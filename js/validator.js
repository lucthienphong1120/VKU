function Validator(formSelector) {
    //Lấy form element trong DOM theo 'formSelector'
    var formElement = document.querySelector(formSelector);
    var inputs = formElement.querySelectorAll(`${formSelector} [name][rules]`)
    var _this = this;
    var formRules = {};


    function getParent (element, selector) {
        while(element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var validatorRules = {
        required(value) {
            return value ? undefined : 'Vui lòng nhập trường này'; 
        },
        email(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email';
        },
        min(min){
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`
            }
        },
        isConfirmed(password) {
            return function(value) {
                return value === document.querySelector(`#register-form ${password}`).value ? undefined : 'Nhập lại mật khẩu không chính xác';
            }
        },
        phone(value) {
            var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            return regex.test(value) ? undefined : 'Vui lòng nhập số điện thoại';
        },
        idcard(value) {
            var regex = /^[0-9]{9}/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng CMND/CCCD';
        }
    }

    //Xử lí hành vi submit form
    formElement.onsubmit = function(e) {
        e.preventDefault();
        var isFormValid = true;


        var formValues = Array.from(inputs).forEach(function (input) {
            if(!handleValidate({ target: input })) {
                isFormValid = false;
            }
        })


        //Khi không có lỗi thì submit form
        if(isFormValid) {
            if(typeof _this.onSubmit === 'function') {
                var formValues = Array.from(inputs).reduce(function (values, input) {
                    switch(input.type) {
                        case 'checkbox':
                            if(!input.matches(':checked')) {
                                return values;
                            }
                            if(!Array.isArray(values[input.name])) {
                                values[input.name] = []
                            }
                            values[input.name].push(input.value)
                            break;
                            case 'radio':
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value;
                                }
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                }, {})
                
                //Gọi lại hàm onSubmit và trả về kèm giá trị các input của form
                _this.onSubmit(formValues)
            } else {
                formElement.submit();
            }
        } 
    }

    // Chỉ xử lí khi có element trong DOM
    if(formElement) {
        Array.from(inputs).forEach(function (input) {
    
            var rules = input.getAttribute('rules').split('|')
            
            for(var rule of rules) {
                var ruleInfo = {};
                var isRuleHasValue = rule.includes(':')
    
                if(rule.includes(':')) {
                    ruleInfo[input.name] = rule.split(':')
                    rule = ruleInfo[input.name][0]
                }

                var ruleFunc = validatorRules[rule];

                if(isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[input.name][1])
                }
                
                if(!Array.isArray(formRules[input.name])) {
                    formRules[input.name] = [];
                }
                formRules[input.name].push(ruleFunc)
            }

            //Lắng nghe sự kiện để validate (blur, change, ....)
            input.onblur = handleValidate;
            
            input.oninput = handleClearError;
        })
    }



    function handleClearError(e) {
        getParent(e.target, '.form-group').querySelector('.form-message').innerText = ''
        getParent(e.target, '.form-group').classList.remove('invalid');
    }


    //Hàm thực hiện validate
    function handleValidate(e) {
        var rules = formRules[e.target.name];
        var errorMessage;
        for(var rule of rules) {
            switch(e.target.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rule(formElement.querySelector('input[name="' + e.target.name + '"]:checked'));
                    break;
                default:
                    errorMessage = rule(e.target.value)
            }
            if(errorMessage) break;

        }
        //Nếu có lỗi thì hiển thị ra UI
        if(errorMessage) {
            var formGroup = getParent(e.target, '.form-group');
            var formMessage = getParent(e.target, '.form-group').querySelector('.form-message');
            if(!formGroup) return;
            formGroup.classList.add('invalid');
            if (formMessage) {
                formMessage.innerText = errorMessage;
            }
        }

        return !errorMessage;
    }

}