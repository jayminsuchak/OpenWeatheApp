import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GetWeatherContainer from '../components/GetWeatherContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <GetWeatherContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
