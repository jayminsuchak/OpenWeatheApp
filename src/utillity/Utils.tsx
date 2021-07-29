import { SynchPlugin } from "synch-plugin";


/**
 * This function is responsible for handling undefined or null objects
 * @param object - object
 * @param args - object args
 * @returns Object or String.
 */
export const getNested = (object: any, ...args: any[]) => {
    try {
        return args.reduce((obj, level) => obj && obj[level], object) === null
            || args.reduce((obj, level) => obj && obj[level], object) === undefined
            ? ''
            : args.reduce((obj, level) => obj && obj[level], object);
    } catch (error) {
        return '';
    }
};

/**
 * This function is responsible to check if the network is connected with wifi or not.
 * @returns {Boolean} true if connected else false.
 */
export const isWifiConnected = async (): Promise<any> => {
    const connectionType = (await SynchPlugin.getStatus()).connectionType
    if (connectionType === 'wifi') {
        return true;
    }
    return false;
};

/**
 * This function is responsible for scheduling the notification to hit the api in timely manner.
 */
export const scheduleNotification = async () => {
    SynchPlugin.schedule({
        notifications: [
            {
                id: 1,
                title: 'Fetching Weather...',
                body: 'Fetching Weather...',
                schedule: {
                    at: new Date(Date.now() + 1000 * 60 * 60 * 2), // in two hour
                    allowWhileIdle: true,
                    repeats: true,
                    every: "hour"
                }
            }
        ]
    })
};