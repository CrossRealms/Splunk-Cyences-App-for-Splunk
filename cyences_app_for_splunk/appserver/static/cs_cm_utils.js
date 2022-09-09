define([
    'jquery',
    'splunkjs/mvc/simplexml/ready!'
], function ($) {

    class CMUtils {

        /* Button Enable/Disable Functions */
        static enableButton(jqueryElementSelector){
            $(jqueryElementSelector).prop('disabled', false);
        }

        static disableButton(jqueryElementSelector){
            $(jqueryElementSelector).prop('disabled', true);
        }

        /* Common Credential Modal Functionality */
        static addModalToHTML(id, title, usernamePlaceholder="Username", passwordPlaceholder="Password"){
            let credentialModalHTMLTemplate = `<p id="${id}_message"/>
            <span class="${id}_loader"/>
            <div class="modal fade" id="${id}_myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display:none;">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header text-center">
                <h4 class="modal-title w-100 font-weight-bold">${title}</h4>
                <button type="button" class="close modelclosebutton" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">Close</span>
                </button>
                </div>
                <div class="modal-body mx-3">
                <div>
                    <p id="${id}_modalMessage"/>
                    <span class="${id}_loader"/>
                </div>
                <div class="md-form mb-5">
                    <i class="fas fa-envelope prefix grey-text"/>
                    <input type="text" id="${id}_username" class="form-control validate" style="width: 100%;" placeholder="${usernamePlaceholder}"/>
                </div>
                <div class="md-form mb-4">
                    <i class="fas fa-lock prefix grey-text"/>
                    <input type="password" id="${id}_password" class="form-control validate" style="width: 100%;" placeholder="${passwordPlaceholder}"/>
                </div>
                </div>
                <div class="modal-footer d-flex justify-content-center text-center">
                <button class="btn btn-success modelconfirmbutton" id="${id}_modelConfirmButton">Confirm</button>
                </div>
            </div>
            </div>
        </div>`;
        $(`#${id}_add_modal_here`).html(credentialModalHTMLTemplate);
        }

        static hideCredentialModel(id){
            $(`#${id}_myModal`).modal('hide');
            $(`#${id}_myModal`).hide();
        }

        static async onClickCredentialModalConfirmButton(id, pageMessageComponent, modalMessageComponent, loaderComponent, callbackActionFunction){
            let username =$(`#${id}_username`).val();
            let password =$(`#${id}_password`).val();
            // TODO - validation here
    
            modalMessageComponent.setMessage('Please wait...');
            loaderComponent.add();
            CMUtils.disableButton("button.modelclosebutton");
            CMUtils.disableButton("button.modelconfirmbutton");
    
            let [isSuccess, message] = await callbackActionFunction(username, password);

            if(isSuccess){
                pageMessageComponent.setSuccessMessage(message);
                modalMessageComponent.setSuccessMessage(message);
    
                CMUtils.hideCredentialModel(id);
                loaderComponent.remove();
            }
            else{
                pageMessageComponent.setFailureMessage(message);
                modalMessageComponent.setFailureMessage(message);
    
                CMUtils.enableButton("button.modelclosebutton");
                CMUtils.enableButton("button.modelconfirmbutton");
                loaderComponent.remove();
            }
        }

        
        static async showCredentialModel(id, pageMessageComponent, modalMessageComponent, loaderComponent, callbackActionFunction){
            CMUtils.enableButton("button.modelclosebutton");
            CMUtils.enableButton("button.modelconfirmbutton");
            loaderComponent.remove();

            $(`#${id}_myModal`).show();
            $(`#${id}_myModal`).modal('show');

            $(`#${id}_modelConfirmButton`).click(function(event){
                CMUtils.onClickCredentialModalConfirmButton(id, pageMessageComponent, modalMessageComponent, loaderComponent, callbackActionFunction);
            });

            $("button.modelclosebutton").click(function(event){
                CMUtils.hideCredentialModel(id);
            });
        }

    }

    return CMUtils;
});
