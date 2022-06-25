import { providers, Contract, utils, BigNumber } from 'ethers';
import mongoose from 'mongoose';
import { badgeContract } from '../config/contract.config';
import { handleOPCOsAdded } from '../handlers/op/opcos.added.handler';
import { handleCitizensAdded } from '../handlers/opco/citizens.added.handler';
import { ICitizen } from '../interfaces/citizen.i';
import { IOPCO } from '../interfaces/opco.i';
import { Citizen } from '../models/citizen.model';
import { OPCO } from '../models/opco.model';

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
}
