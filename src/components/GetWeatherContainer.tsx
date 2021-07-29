import React, { useState } from 'react';

import { SynchPlugin } from 'synch-plugin';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';
import {
  IonContent, IonHeader, IonPage,
  IonTitle, IonToolbar, IonCard, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonItem, IonIcon, IonLabel, IonLoading, IonToast
} from '@ionic/react';
import { speedometer, cloud, cloudOutline, waterSharp, paperPlane, thermometerOutline } from 'ionicons/icons';

import moment from 'moment';

import './GetWeatheContainer.css';
import { getNested, isWifiConnected, scheduleNotification } from '../utillity/Utils';
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

  /**
    * This function is responsible for save the response when the api gives response.
  */
  const saveWeather = async (weatherResponse: string) => {
    await SynchPlugin.set({
      key: 'Weather',
      value: weatherResponse,
    });
  };

  /**
    * This function is responsible to get the api response from local if it is available
  */
  const checkWeather = async () => {
    const { value } = await SynchPlugin.get({ key: 'Weather' });
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



  /**
     * This function is responsible for get the location from Plugin.
  */
  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await SynchPlugin.getCurrentPosition();
      NativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude, options)
        .then((result: NativeGeocoderResult[]) => setCity(result[0].subAdministrativeArea))
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
          'appid': '28181a814f0231d9cbe8720984934aef'
        }
      }).then(res => {
        if (getNested(res, 'status') === 200) {
          // setLoading(false);

          setWeather(res.data);
          saveWeather(JSON.stringify(res.data))
          scheduleNotification();
          addNotificationListner();
        } else {
          setError(res.data);
        }

      })
    }
  }

  //UI 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>OpenWeatherApp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={'Getting Location...'}
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
          <IonItem>
            <IonLabel>Temprature</IonLabel>
          </IonItem>
          <IonCardContent>

            <IonItem>
              <IonIcon icon={paperPlane} slot="start" />
              <IonCardTitle>
                {`${getNested(weather, 'name')} - ${getNested(weather, 'sys', 'country')}` || '--'}
              </IonCardTitle>
            </IonItem>

            <IonItem>
              <IonIcon icon={thermometerOutline} slot="start" />
              <IonCardTitle>
                {`${getNested(weather, 'main', 'temp')}${'\xB0F'}` || '--'}
              </IonCardTitle>
            </IonItem>

            <IonItem>
              <IonIcon icon={thermometerOutline} slot="start" />
              <IonCardTitle>
                {`Feels like : ${getNested(weather, 'main', 'feels_like')}${'\xB0F'}` || '--'}
              </IonCardTitle>
            </IonItem>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonLabel>Description</IonLabel>
          </IonItem>
          <IonCardContent>

            <IonItem>
              <IonIcon icon={cloud} slot="start" />
              <IonCardTitle>
                {`${getNested(weather, 'weather', '0', 'main')}` || '--'}
              </IonCardTitle>
            </IonItem>

            <IonItem>
              <IonIcon icon={cloudOutline} slot="start" />
              <IonCardTitle>
                {`${getNested(weather, 'weather', '0', 'description')}` || '--'}
              </IonCardTitle>
            </IonItem>

          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonLabel>Other Information</IonLabel>
          </IonItem>

          <IonCardContent>

            <IonItem>
              <IonIcon icon={thermometerOutline} slot="start" />
              <IonCardTitle>
                {`Min temp : ${getNested(weather, 'main', 'temp_min')}${'\xB0F'}` || '--'}
              </IonCardTitle>
            </IonItem>

            <IonItem>
              <IonIcon icon={thermometerOutline} slot="start" />
              <IonCardTitle>
                {`Max temp : ${getNested(weather, 'main', 'temp_max')}${'\xB0F'}` || '--'}
              </IonCardTitle>
            </IonItem>

            <IonItem>
              <IonIcon icon={thermometerOutline} slot="start" />
              <IonCardTitle>
                {`Pressure : ${getNested(weather, 'main', 'pressure')}` || '--'}
              </IonCardTitle>
            </IonItem>

            <IonItem>
              <IonIcon icon={waterSharp} slot="start" />
              <IonCardTitle>
                {`Humidity : ${getNested(weather, 'main', 'humidity')}` || '--'}
              </IonCardTitle>
            </IonItem>

            <IonItem>
              <IonIcon icon={speedometer} slot="start" />
              <IonCardTitle>
                {`Wind Speed :${getNested(weather, 'wind', 'speed')}` || '--'}
              </IonCardTitle>
            </IonItem>



          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>

  );
};

export default GetWeatherContainer;
