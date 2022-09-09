import { BreakpointObserver } from '@angular/cdk/layout';
import {Component, OnInit, ViewChild} from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { MatHorizontalStepper } from '@angular/material/stepper';
import {CommonForm} from "../../../../configurations/commons/common-form";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import { NgxSmartModalService } from 'ngx-smart-modal';
import {ClimateRisk} from "../../climate-risk";
import {ClimateRiskService} from "../../climate-risk-service";

export interface PeriodicElement {
    safra: string;
    municipio: string;
    portaria: string;
    cultura: string;
    ciclo: string;
    solo: string;
    valor1: string;
    valor2: string;
    valor3: string;
    valor4: string;
    valor5: string;
    valor6: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {safra: '21/22', municipio: 'Barreiras', portaria: '000038', cultura: 'Soja',ciclo: 'grupo B', solo: 'Arenoso', valor1: '20%', valor2: '20%', valor3: '20%', valor4: '20%', valor5: '20%', valor6: '20%'},
    {safra: '21/22', municipio: 'Barreiras', portaria: '000038', cultura: 'Soja',ciclo: 'grupo B', solo: 'Arenoso', valor1: '20%', valor2: '20%', valor3: '20%', valor4: '20%', valor5: '20%', valor6: '20%'},
    {safra: '21/22', municipio: 'Barreiras', portaria: '000038', cultura: 'Soja',ciclo: 'grupo B', solo: 'Arenoso', valor1: '20%', valor2: '20%', valor3: '20%', valor4: '20%', valor5: '20%', valor6: '20%'},
    {safra: '21/22', municipio: 'Barreiras', portaria: '000038', cultura: 'Soja',ciclo: 'grupo B', solo: 'Arenoso', valor1: '20%', valor2: '20%', valor3: '20%', valor4: '20%', valor5: '20%', valor6: '20%'},
    {safra: '21/22', municipio: 'Barreiras', portaria: '000038', cultura: 'Soja',ciclo: 'grupo B', solo: 'Arenoso', valor1: '20%', valor2: '20%', valor3: '20%', valor4: '20%', valor5: '20%', valor6: '20%'},
    {safra: '21/22', municipio: 'Barreiras', portaria: '000038', cultura: 'Soja',ciclo: 'grupo B', solo: 'Arenoso', valor1: '20%', valor2: '20%', valor3: '20%', valor4: '20%', valor5: '20%', valor6: '20%'},
    {safra: '21/22', municipio: 'Barreiras', portaria: '000038', cultura: 'Soja',ciclo: 'grupo B', solo: 'Arenoso', valor1: '20%', valor2: '20%', valor3: '20%', valor4: '20%', valor5: '20%', valor6: '20%'},
];


@Component({
    selector: 'climate-risk-form',
    templateUrl: './climate-risk-form.component.html',
    styleUrls: ['./climate-risk-form.component.scss']
})
export class ClimateRiskFormComponent extends CommonForm<ClimateRisk> implements OnInit {

    displayedColumns: string[] = ['safra', 'municipio', 'portaria', 'cultura', 'ciclo', 'solo', 'valor1', 'valor2', 'valor3', 'valor4', 'valor5', 'valor6'];
    dataSource = ELEMENT_DATA;

    isMobile = false
    result: ClimateRisk;

    @ViewChild('drawerContent')
    drawerContent: MatDrawerContent

    @ViewChild('stepper')
    stepper: MatHorizontalStepper

    viewMode;
    ngOnInit() {
        super.ngOnInit();
        this.builderForm();
        this.viewMode = "tab1";
    }

    constructor(breakpoint$: BreakpointObserver,
                protected activatedRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                public modalService: NgxSmartModalService,
                protected baseService: ClimateRiskService) {
        super(activatedRoute, baseService);
        breakpoint$
            .observe(['(max-width: 700px)'])
            .subscribe(result => this.isMobile = result.matches)

    }

    next() {
        this.result = this.beanActive?.result;
        this.stepper.next()
        this.scrollToTop()
    }

    previous() {
        this.stepper.previous()
        this.scrollToTop()
    }

    private scrollToTop() {
        this.drawerContent.getElementRef().nativeElement.scroll(0, 0)
    }

    builderForm() {
        this.formDefault =  this.formBuilder.group({
            resp_name: [null],
            organization: [null],
            date: [null],
            producer_name: [null],
            property_name: [null],
            address: [null],
            region: [null],
            estate: [null],
            city: [null],
            latitude: [null],
            longitude: [null],
            cultive_area: [null],
            crop_year: [null],
            crop_year_second: [null],
            cultivation_area_second_crop: [null],
            culture_type_second_crop: [null],
            biome_first: [null],
            biome_second: [null],
            biome_third: [null],
            planting_date: [null],
            harvest_date: [null],
            average_productivity: [null],
            average_production: [null],
            planting_date_second_crop: [null],
            harvest_date_second_crop: [null],
            average_productivity_second_crop: [null],
            average_production_second_crop: [null],
            texture_class: [null],
            clay_content: [null],
            Adoption_years: [null],
            area_organic_soils: [null],
            land_usage: [null],
            synthetic_n_fertilizer_type1_kg: [null],
            synthetic_n_fertilizer_type2_kg: [null],
            synthetic_n_fertilizer_type3_kg: [null],
            synthetic_n_fertilizer_teor_type1: [null],
            synthetic_n_fertilizer_teor_type2: [null],
            synthetic_n_fertilizer_teor_type3: [null],
            urea_type1: [null],
            organic_n_fertilizer_type1_kg: [null],
            green_adubation: [null],
            grassy_type1_kg: [null],
            others_type1_kg: [null],
            synthetic_n_fertilizer_type1_kg_second_crop: [null],
            synthetic_n_fertilizer_type2_kg_second_crop: [null],
            synthetic_n_fertilizer_type3_kg_second_crop: [null],
            synthetic_n_fertilizer_teor_type1_second_crop: [null],
            synthetic_n_fertilizer_teor_type2_second_crop: [null],
            synthetic_n_fertilizer_teor_type3_second_crop: [null],
            urea_type1_second_crop: [null],
            organic_n_fertilizer_type1_kg_second_crop: [null],
            green_adubation_second_crop: [null],
            grassy_type1_kg_second_crop: [null],
            others_type1_kg_second_crop: [null],
            calcitic_limestone: [null],
            dolomitic_limestone: [null],
            agricultural_plaster: [null],
            calcitic_limestone_second_crop: [null],
            dolomitic_limestone_second_crop: [null],
            agricultural_plaster_second_crop: [null],
            productivity: [null],
            cultivated_area: [null],
            waste_field: [null],
            productivity_second_crop: [null],
            cultivated_area_second_crop: [null],
            waste_field_second_crop: [null],
            gasoline_mechanical_operation: [null],
            diesel_b10_mechanical_operation: [null],
            hydrous_ethanol_mechanical_operation: [null],
            gasoline_stationary_operation: [null],
            diesel_b10_stationary_operation: [null],
            hydrous_ethanol_stationary_operation: [null],
            transport_production_diesel_b10: [null],
            energy_consumption: [null],
            rl: [null],
            app: [null],
            forest_surplus: [null]
        });
    }

}
