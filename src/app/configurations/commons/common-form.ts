import {Component, OnInit} from "@angular/core";
import {CommonModel} from "./common-model";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "./common.service";

@Component({template:''} )
export abstract class CommonForm<T extends CommonModel> implements OnInit{

    beanId: string;
    beanActive: T;
    formDefault: FormGroup;
    mode: string;

    protected constructor(protected activatedRoute: ActivatedRoute,
                          protected baseService: CommonService<T>
                         ) {
    }

    protected async loadContent() {}

    ngOnInit(): void {
        this.initialize();
    }

    private initialize(){
        this.builderForm();
        this.beanId = this.activatedRoute.snapshot.paramMap.get('id');
        (!this.beanId || this.beanId === 'novo') ? this.loadCreateSettings() : this.loadViewSettings();
    }

    protected abstract builderForm();

    async onSubmitFormDefault(event): Promise<any> {
        event.preventDefault();

        if(this.formDefault.valid) {
            this.mode = 'CREATE';
            this.beanActive = this.formDefault.value as T;
            const result = await this.baseService.add(this.beanActive)
            
            if(result) {
                console.log(result);
                return result
            } else {
                return null
            }
        } else {
           // AppUtils.handlerFormError(this.formDefault, this.toolService);
            console.log("erro...");
            return null
        }
    }


    onClickActionButtons(action: string) {
        switch (action) {
            case 'edit': {
                this.loadEditSettings();
                break;
            }
        }
    }

    protected formValuesUp() {
        this.formDefault.patchValue(this.beanActive);
       // console.log(this.beanActive)
      //  this.formDefault.disable();
    }

    protected async loadCreateSettings() {
        this.mode = 'CREATE';
        await this.loadContent();
    }

    protected async loadViewSettings() {
        this.mode = 'VIEW';
        await this.loadContent();
        this.beanActive = await this.baseService.loadById(this.beanId);
        this.formValuesUp();
    }

    protected loadEditSettings() {
        this.mode = 'EDIT';
       // this.toolService.toastr.info('O modo de edição foi habilitado.', 'Informação');
        this.formDefault.enable();
    }

    public getControlGroupByFormDefault(name: string): FormGroup {
        return this.formDefault.get(name) as FormGroup;
    }
}
