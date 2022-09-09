import { Protocol } from "../models/protocol.model";

export interface ProtocolForm {

    getValues(): Protocol | null
    
}