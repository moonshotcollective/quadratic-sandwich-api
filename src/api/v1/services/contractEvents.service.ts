import { badgeContract } from '../config/contract.config';
import { handleOPCOsAdded } from '../handlers/events/opcos.added.handler';
import { handleCitizensAdded } from '../handlers/events/citizens.added.handler';
import { handleMinted } from '../handlers/events/minted.handler';

export default class ContractEventService {
    private badgeContract = badgeContract;

    constructor() {
        console.log({
            level: 'info',
            message: `Starting Contract Event Service on ${badgeContract.address}`,
        });
        this.initializeContractEventService();
    }

    async initializeContractEventService() {
        this.addCitizensEventHandler();
        this.addOPCOsEventHandler();
        this.mintedEventHandler();
    }

    private addOPCOsEventHandler() {
        this.badgeContract.on(
            'OPCOsAdded',
            handleOPCOsAdded
        );
    }
    /** Enable the SetCitizen Event Handler.
     *  This listens for the SetCitizens Contract emission which then retrivies
     *  the OpCo citizen list and applies it to the database.
     */
    private addCitizensEventHandler() {
        this.badgeContract.on(
            'CitizensAdded',
            handleCitizensAdded
        );
    }

    private mintedEventHandler() {
        this.badgeContract.on(
            'Minted', 
            handleMinted
        )
    }
}
