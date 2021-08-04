import React, { useState } from 'react';

import { SynchPlugin } from 'synch-plugin';

import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';

import {
  IonContent, IonHeader, IonPage,
  IonTitle, IonToolbar, IonCard, IonCardSubtitle, IonCardContent, IonLoading, IonToast
} from '@ionic/react';

import { ItemIconTitle } from './widgets/ItemIconTitle';
import { ItemTitle } from './widgets/ItemTitle';
import { getNested, isWifiConnected, scheduleNotification } from '../utillity/Utils';
import { ConstantStrings } from '../utillity/Constant';

import { speedometer, cloud, cloudOutline, waterSharp, paperPlane, thermometerOutline } from 'ionicons/icons';

import moment from 'moment';

import './GetWeatherContainer.css';
import ApiService from '../api/GetWeather';


interface LocationError {
  showError: boolean;
  message?: string;
}
export const SELECTED_DATE_FORMAT = 'MMM DD, YYYY h:mm A';

const GetWeatherContainer: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<LocationError>({ showError: false });
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<object>();
  const [pendingNotificaton, setPendingNotification] = useState<number>(-1);
  const [wifiConnected, setWifiConnected] = useState<boolean>(true);


  /**
    * This function is responsible for save the response when the api gives response.
  */
  const saveWeather = async (weatherResponse: string) => {
    await SynchPlugin.set({
      key: ConstantStrings.STR_WEATHER,
      value: weatherResponse,
    });
  };

  /**
    * This function is responsible to get the api response from local if it is available
  */
  const checkWeather = async () => {
    const { value } = await SynchPlugin.get({ key: ConstantStrings.STR_WEATHER });
    setWeather(value != null ? JSON.parse(value) : '');
  };

  let options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  React.useEffect(() => {
    const notification = Promise.resolve(SynchPlugin.getPending())
    notification.then((value) => setPendingNotification(value.notifications.length))
  }, [])

  React.useEffect(() => {
    const isConnected = Promise.resolve(isWifiConnected());
    isConnected.then((connected) => {
      setWifiConnected(connected)
      if (connected && pendingNotificaton === 0) {
        getLocation();
      } else {
        checkWeather();
      }
    });
  }, [pendingNotificaton])


  React.useEffect(() => {
    getWeatherInfo();
  }, [city])

  React.useEffect(() => {
    if (!wifiConnected) {
      setError({ showError: true, message: "Wifi is not connected. Please try once wifi is available" });
    }
  }, [wifiConnected])



  /**
     * This function is responsible for get the location from Plugin.
  */
  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await SynchPlugin.getCurrentPosition();
      NativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude, options)
        .then((result: NativeGeocoderResult[]) => setCity(result[0].locality || result[0].subAdministrativeArea || result[0].countryName))
        .catch((error: any) => console.log(error));

      setLoading(false);
      setError({ showError: false });
    } catch (e) {
      setError({ showError: true, message: e.message });
      setLoading(false);
    }
  }

  /**
     * This function is responsible add the observable if notification is recevied
  */
  const addNotificationListner = async () => {
    SynchPlugin.addListener('localNotificationReceived', () => {
      const isConnected = Promise.resolve(isWifiConnected());
      isConnected.then((connected) => {
        if (connected) {
          getLocation();
        } else {
          checkWeather();
        }
      });
    })
  }
  /**
   * This function is responsible for fetching the data from the API.
   */
  const getWeatherInfo = async () => {
    if (city !== '') {
      ApiService.get('/weather', {
        params: {
          'q': city,
          'appid': ConstantStrings.STR_APP_ID
        }
      }).then(res => {
        if (getNested(res, 'status') === 200) {
          setWeather(res.data);
          saveWeather(JSON.stringify(res.data))
          scheduleNotification();
          addNotificationListner();
        } else {
          setError({ showError: true, message: res.data })
        }
      }).catch(error => {
        setError({ showError: true, message: getNested(error, 'response', 'data', 'message') })
      })
    }
  }

  //UI 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{ConstantStrings.STR_APP_NAME}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={ConstantStrings.STR_GET_LOCATION}
      />
      <IonToast
        isOpen={error.showError}
        onDidDismiss={() => setError({ message: "", showError: false })}
        message={error.message}
        duration={3000}
      />

      <IonContent>

        <IonCard>
          <IonCardContent>
            <IonCardSubtitle>{`${moment(new Date()).format(SELECTED_DATE_FORMAT)}`}</IonCardSubtitle>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <ItemTitle title={ConstantStrings.STR_TEMPRATURE}></ItemTitle>
          <IonCardContent>

            <ItemIconTitle imageSource={paperPlane}
              title={`${getNested(weather, 'name')} -- ${getNested(weather, 'sys', 'country')} `}></ItemIconTitle>


            <ItemIconTitle imageSource={thermometerOutline}
              title={getNested(weather, 'main', 'temp') ? `${getNested(weather, 'main', 'temp')}${'\xB0F'}` : '--'}></ItemIconTitle>


            <ItemIconTitle imageSource={thermometerOutline}
              title={getNested(weather, 'main', 'feels_like') ? `Feels like : ${getNested(weather, 'main', 'feels_like')}${'\xB0F'}` : '--'}></ItemIconTitle>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <ItemTitle title={ConstantStrings.STR_DESCRIPTION}></ItemTitle>
          <IonCardContent>

            <ItemIconTitle imageSource={cloud}
              title={`${getNested(weather, 'weather', '0', 'main')}` || '--'}
            ></ItemIconTitle>

            <ItemIconTitle imageSource={cloudOutline}
              title={`${getNested(weather, 'weather', '0', 'description')}` || '--'}
            ></ItemIconTitle>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <ItemTitle title={ConstantStrings.STR_DESCRIPTION}></ItemTitle>
          <IonCardContent>
            <ItemIconTitle imageSource={thermometerOutline}
              title={getNested(weather, 'main', 'temp_min') ? `Min temp : ${getNested(weather, 'main', 'temp_min')}${'\xB0F'}` : 'Min temp : --'}
            ></ItemIconTitle>

            <ItemIconTitle imageSource={thermometerOutline}
              title={getNested(weather, 'main', 'temp_max') ? `Max temp : ${getNested(weather, 'main', 'temp_max')}${'\xB0F'}` : 'Max temp : --'}
            ></ItemIconTitle>

            <ItemIconTitle imageSource={thermometerOutline}
              title={`Pressure : ${getNested(weather, 'main', 'pressure') || '--'}`}
            ></ItemIconTitle>

            <ItemIconTitle imageSource={waterSharp}
              title={`Humidity : ${getNested(weather, 'main', 'humidity') ? getNested(weather, 'main', 'humidity') + '%' : '--'}`}
            ></ItemIconTitle>

            <ItemIconTitle imageSource={speedometer}
              title={`Wind Speed : ${getNested(weather, 'wind', 'speed') || '--'}`}
            ></ItemIconTitle>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>

  );
};

export default GetWeatherContainer;
