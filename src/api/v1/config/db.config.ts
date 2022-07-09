import mongoose from 'mongoose';
import { IOnConnectedCallback } from '../interfaces/onConnectedCallback.i';

// To use global promise for mongoose
(<any>mongoose).Promise = global.Promise;

export default class MongoConnection {
    /** URL to access mongo */
    private readonly mongoUri: string;

    /** Callback when mongo connection is established or re-established */
    private onConnectedCallback!: IOnConnectedCallback;

    /**
     * Internal flag to check if connection established for
     * first time or after a disconnection
     */
    private isConnectedBefore: boolean = false;

    /**
     * Start mongo connection
     * @param mongoUri MongoDB URL
     * @param onConnectedCallback callback to be called when mongo connection is successful
     */
    constructor(mongoUri: string) {
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }

        this.mongoUri = mongoUri;
        mongoose.connection.on('error', this.onError);
        mongoose.connection.on('disconnected', this.onDisconnected);
        mongoose.connection.on('connected', this.onConnected);
        mongoose.connection.on('reconnected', this.onReconnected);
    }

    /** Close mongo connection */
    public close(onClosed: (err: any) => void) {
        console.log({
            level: 'info',
            message: 'Closing the MongoDB connection',
        });
        // noinspection JSIgnoredPromiseFromCall
        mongoose.connection.close(onClosed);
    }

    /** Start mongo connection */
    public connect(onConnectedCallback: IOnConnectedCallback): mongoose.Connection {
        this.onConnectedCallback = onConnectedCallback;
        this.startConnection();
        return mongoose.connection;
    }

    private startConnection = () => {
        console.log({
            level: 'info',
            message: `Connecting to MongoDB at ${this.mongoUri}`,
        });
        mongoose.connect(this.mongoUri).catch(() => {});
    };

    /**
     * Handler called when mongo connection is established
     */
    private onConnected = () => {
        console.log({
            level: 'info',
            message: `Connected to MongoDB at ${this.mongoUri}`,
        });
        this.isConnectedBefore = true;
        this.onConnectedCallback();
    };

    /** Handler called when mongo gets re-connected to the database */
    private onReconnected = () => {
        console.log({
            level: 'info',
            message: 'Reconnected to MongoDB',
        });
        this.onConnectedCallback();
    };

    /** Handler called for mongo connection errors */
    private onError = () => {
        console.log({
            level: 'error',
            message: `Could not connect to ${this.mongoUri}`,
        });
    };

    /** Handler called when mongo connection is lost */
    private onDisconnected = () => {
        if (!this.isConnectedBefore) {
            setTimeout(() => {
                this.startConnection();
            }, 2000);
            console.log({
                level: 'info',
                message: 'Retrying mongo connection',
            });
        }
    };
}
