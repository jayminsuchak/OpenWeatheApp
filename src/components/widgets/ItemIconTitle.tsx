import React from 'react';
import { IonItem, IonIcon, IonCardTitle } from "@ionic/react"

interface GetWeatheContainerProps {
    imageSource: string;
    title: string
}

export const ItemIconTitle: React.FC<GetWeatheContainerProps> = ({
    imageSource, title
}) => {
    return (
        <IonItem>
            <IonIcon icon={imageSource} slot="start" />
            <IonCardTitle>
                {title}
            </IonCardTitle>
        </IonItem>
    )
}
