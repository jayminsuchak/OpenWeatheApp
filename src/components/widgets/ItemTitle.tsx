import React from 'react';
import { IonItem, IonLabel } from "@ionic/react"

interface GetWeatheContainerProps {
    title: string
}

export const ItemTitle: React.FC<GetWeatheContainerProps> = ({
    title
}) => {
    return (
        <IonItem>
            <IonLabel>{title}</IonLabel>
        </IonItem>
    )
}
