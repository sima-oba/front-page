import {CommonModel} from './common-model';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonService} from './common.service';
import {ToolsService} from "../../shared/tools/tools.service";
import Swal from 'sweetalert2'

@Component({ template: '' })
export abstract class CommonGrid<T extends CommonModel> implements OnInit, AfterViewInit, OnDestroy {

    beans: Array<T> = new Array<T>();
    beansSelected: Array<T> = new Array<T>();
    beanActive: T;

    beanName: string;

    isLoadBeans: boolean = true;

    protected constructor(protected baseService: CommonService<T>,
                          public toolService: ToolsService) {
    }

    public get service(): CommonService<T> {
        return this.baseService;
    }

    ngOnInit(): void {
        this.initialize();
    }

    protected initialize() {
        if(this.isLoadBeans) {
            this.loadBeans();

        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Acorreu um erro ao carregar os registros',
                showConfirmButton: false,
                timer: 2500
            })        }
    }

    protected loadBeans() {
        this.baseService.loadAll().then((result) => {
            if(result) {
                this.beans = result.sort((i1, i2) => i1.created_at > i2.created_at ? 1 : -1);
            }
        }).finally(() => '');
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

}
