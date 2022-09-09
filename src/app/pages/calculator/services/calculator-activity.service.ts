import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { CommonService } from "../../../configurations/commons/common.service";
import { CalculatorActivity, Biome, CultivationSystem, LandOccupation } from "../models/calculator-activity.model";
import { CalculatorSettings } from '../models/calculator-settings.model';


@Injectable({ providedIn: 'root' })
export class ActivityService extends CommonService<CalculatorActivity> {
    biomes$: Observable<Biome[]>
    cultivationSystems$: Observable<CultivationSystem[]>
    landOccupation$: Observable<LandOccupation[]>

    constructor(protected http: HttpClient) {
        super(http)

        const settings$ = this.getSettings().pipe(
            shareReplay()
        )

        this.biomes$ = settings$.pipe(
            map(this.getBiomes)
        )

        this.cultivationSystems$ = settings$.pipe(
            map(this.getCultivationSystems)
        )

        this.landOccupation$ = settings$.pipe(
            map(this.getLandOccupation)
        )
    }

    getServerPath(): string {
        return 'producer/calculator'
    }

    private getSettings(): Observable<CalculatorSettings> {
        return this.http.get<CalculatorSettings>('/producer/calculator/settings')
    }

    private getBiomes = (settings: CalculatorSettings): Biome[] => {
        return [
            {
                value: settings.preserved_native_forest_soil_1,
                description: 'Amazônia (Floresta Ombrófila Aberta Terras Baixas)'
            },
            {
                value: settings.preserved_native_forest_soil_2,
                description: 'Amazônia (Floresta Ombrófila Aberta Submontana)'
            },
            {
                value: settings.preserved_native_forest_soil_3,
                description: 'Amazônia (Floresta Ombrófila Densa Aluvial)'
            },
            {
                value: settings.preserved_native_forest_soil_24,
                description: 'Amazônia (Floresta Ombrófila Densa de Terras Baixas)'
            },
            {
                value: settings.preserved_native_forest_soil_5,
                description: 'Amazônia (Floresta Ombrófila Densa Submontana)'
            },
            {
                value: settings.preserved_native_forest_soil_6,
                description: 'Amazônia (Floresta Estacional Semidecidual Submontana)'
            },
            {
                value: settings.preserved_native_forest_soil_7,
                description: 'Amazônia (Floresta Ombrófila Aberta Aluvial)'
            },
            {
                value: settings.preserved_native_forest_soil_8,
                description: 'Amazônia (Campinarana Florestada)'
            },
            {
                value: settings.preserved_native_forest_soil_9,
                description: 'Amazônia (Vegetação com influência fluvial e/ou lacustre)'
            },
            {
                value: settings.preserved_native_forest_soil_10,
                description: 'Amazônia (Savana Arborizada)'
            },
            {
                value: settings.preserved_native_forest_soil_11,
                description: 'Amazônia (Savana Florestada)'
            },
            {
                value: settings.preserved_native_forest_soil_12,
                description: 'Amazônia (Savana Parque)'
            },
            {
                value: settings.preserved_native_forest_soil_13,
                description: 'Cerrado (Savana Arborizada)'
            },
            {
                value: settings.preserved_native_forest_soil_14,
                description: 'Cerrado (Savana Florestada (BA-DF-GO-MG))'
            },
            {
                value: settings.preserved_native_forest_soil_15,
                description: 'Cerrado (Savana Florestada (MS-MT))'
            },
            {
                value: settings.preserved_native_forest_soil_16,
                description: 'Cerrado (Savana Florestada (MA-PI-TO))'
            },
            {
                value: settings.preserved_native_forest_soil_17,
                description: 'Cerrado (Savana Gramíneo-lenhosa)'
            },
            {
                value: settings.preserved_native_forest_soil_18,
                description: 'Cerrado (Contato Savana/Floresta Estacional)'
            },
            {
                value: settings.preserved_native_forest_soil_19,
                description: 'Cerrado (Savana Parque)'
            },
            {
                value: settings.preserved_native_forest_soil_20,
                description: 'Cerrado (Floresta Estacional Decidual Montana (BA-GO-MG-PI))'
            },
            {
                value: settings.preserved_native_forest_soil_21,
                description: 'Cerrado (Floresta Estacional Decidual Montana (MS-TO))'
            },
            {
                value: settings.preserved_native_forest_soil_22,
                description: 'Cerrado (Floresta Estacional Decidual Submontana (BA-GO-MA-MG-PI-TO))'
            },
            {
                value: settings.preserved_native_forest_soil_23,
                description: 'Cerrado (Floresta Estacional Decidual Submontana (MS-MT-SP))'
            },
            {
                value: settings.preserved_native_forest_soil_24,
                description: 'Cerrado (Floresta Estacional Semidecidual Aluvial (MA-PA-TO))'
            },
            {
                value: settings.preserved_native_forest_soil_25,
                description: 'Cerrado (Floresta Estacional Semidecidual Aluvial (BA-GO-MG-PI))'
            },
            {
                value: settings.preserved_native_forest_soil_26,
                description: 'Cerrado (Floresta Estacional Semidecidual Aluvial (MS-MT))'
            },
            {
                value: settings.preserved_native_forest_soil_27,
                description: 'Cerrado (Floresta Estacional Semidecidual Montana (BA-PI))'
            },
            {
                value: settings.preserved_native_forest_soil_28,
                description: 'Cerrado (Floresta Estacional Semidecidual Montana (GO-MG-MS-PR-SP-TO))'
            },
            {
                value: settings.preserved_native_forest_soil_29,
                description: 'Cerrado (Floresta Estacional Semidecidual Submontana (BA-MA-PI))'
            },
            {
                value: settings.preserved_native_forest_soil_30,
                description: 'Cerrado (Floresta Estacional Semidecidual Submontana (GO/MG/MS/MT/SP/TO))'
            },
            {
                value: settings.preserved_native_forest_soil_31,
                description: 'Cerrado (Savana)'
            }
        ]
    }

    private getCultivationSystems = (settings: CalculatorSettings): CultivationSystem[] => {
        return [
            {
                value: settings.no_tillage_system_coverage,
                description: 'Sistema de Plantio Direto (SPD) - Uso de cobertura'
            },
            {
                value: settings.no_tillage_system,
                description: 'Sistema de Plantio Direto (SPD)'
            },
            {
                value: settings.conventional_planting_system,
                description: 'Sistema de Plantio Convencional (SPC)'
            }
        ]
    }

    private getLandOccupation = (settings: CalculatorSettings): LandOccupation[] => {
        return [
            {
                value: settings.land_occupation_1,
                description: 'Cultivo Convencional → iLPF (Geral)'
            },
            {
                value: settings.land_occupation_2,
                description: 'Cultivo Convencional → Plantio Direto (Demais Regiões)'
            },
            {
                value: settings.land_occupation_3,
                description: 'Cultivo Convencional → Plantio Direto (Sul)'
            },
            {
                value: settings.land_occupation_4,
                description: 'Pastagem Degradada → Cultivo Convencional (Geral)'
            },
            {
                value: settings.land_occupation_5,
                description: 'Pastagem Degradada → iLPF (Geral)'
            },
            {
                value: settings.land_occupation_6,
                description: 'Pastagem Degradada → Plantio Direto (Geral)'
            },
            {
                value: settings.land_occupation_7,
                description: 'Pastagem/Pastagem melhorada → iLPF (Geral)'
            },
            {
                value: settings.land_occupation_8,
                description: 'Plantio Direto → Cultivo Convencional (Geral)'
            },
            {
                value: settings.land_occupation_9,
                description: 'Plantio Direto → iLPF (Geral)'
            },
            {
                value: settings.land_occupation_10,
                description: 'Floresta Nativa → Cultivo Convencional (Argila > 60%)'
            },
            {
                value: settings.land_occupation_11,
                description: 'Floresta Nativa → Cultivo Convencional (Argila < 60%)'
            },
            {
                value: settings.land_occupation_12,
                description: 'Floresta Nativa → iLPF (Geral)'
            },
            {
                value: settings.land_occupation_13,
                description: 'Floresta Nativa → Plantio Direto (Amazônia)'
            },
            {
                value: settings.land_occupation_14,
                description: 'Floresta Nativa → Plantio Direto (Cerrado)'
            },
            {
                value: settings.land_occupation_15,
                description: 'Floresta Nativa → Pastagem Degradada'
            },
            {
                value: settings.land_occupation_16,
                description: 'Floresta Nativa → Pastagem Nominal'
            },
            {
                value: settings.land_occupation_17,
                description: 'Floresta Nativa → Pastagem Melhorada'
            }
        ]
    }

}
