window.addEventListener('DOMContentLoaded', function () {
  // Mobile phone mask
  var phoneMask = new Inputmask("+7 (999) 999-99-99");
  var phoneNumbers = document.querySelectorAll(".phone");
  phoneNumbers.forEach((phone) => {
    phoneMask.mask(phone);
  })

  // Profile Delete
  if (document.getElementById('profile-delete')) {
    const deleteButton = document.getElementById('profile-delete');
    const deleteForm = document.querySelector('.profile__delete');

    if (deleteButton) {
      const userId = document.querySelector('input[type="hidden"]').value;

      deleteButton.addEventListener('click', (event) => {
        deleteButton.style.display = 'none';
        deleteForm.style.display = 'block';
      });

      document.querySelector('#profile-delete-btn').addEventListener('click', () => {
        fetch('/users/' + userId, { method: 'DELETE', redirect: 'manual' })
          .then(res => location.href = '/')
          .catch(err => console.log(err));
      })
    }
  }

  if (document.querySelector('#request__form')) {
    const costField = document.querySelector('#cost');
    const countField = document.querySelector('#count');
    const totalInputs = [document.querySelector('#cost'), document.querySelector('#count')];

    totalInputs.forEach(function (field) {
      field.addEventListener('input', function () {
        var total = costField.value * countField.value;

        document.querySelector('#total').value = total;
        document.querySelector('.request-data__total').innerHTML = total;
      });
    });
  }

  // Forms
  if (document.getElementById('login-form')) {
    const selector = document.querySelector("input[type='tel']");
    // const im = new Inputmask("+7 (999) 999-99-99");
    phoneMask.mask(selector);

    new window.JustValidate('#login-form', {
      colorWrong: '#ec1818',
      rules: {
        tel: {
          required: true,
          function: (name, value) => {
            const phone = selector.inputmask.unmaskedvalue()
            console.log(phone)
            return Number(phone) && phone.length === 10
          }
        },
        password: {
          required: true,
        }
      },
      messages: {
        tel: {
          required: '- Обязательное поле',
          function: '- Номер указан неверно'
        },
        password: {
          required: '- Обязательное поле',
        }
      }
    });
  }

  if (document.getElementById('register-form')) {
    const selector = document.querySelector("input[type='tel']");
    // const im = new Inputmask("+7 (999) 999-99-99");
    phoneMask.mask(selector);
    const fetchCodeBtn = document.querySelectorAll('.register__btn-code');
    const phone2 = new window.JustValidate('#register-form', {
      colorWrong: '#ec1818',
      rules: {
        tel: {
          required: true,
          function: (name, value) => {
            const phone = selector.inputmask.unmaskedvalue()
            return Number(phone) && phone.length === 10
          }
        },
        'confirm-code': {
          function: (name, value) => {
            return value.length === 4;
          }
        },
        password: {
          required: true,
          minLength: 6
        },
        'repeat-password': {
          required: true,
          minLength: 6,
          function: (name, value) => {
            return value === document.querySelector('#password').value;
          }
        }
      },
      messages: {
        tel: {
          required: 'Обязательное поле',
          function: 'Номер указан неверно'
        },
        'confirm-code': {
          required: 'Обязательное поле',
          function: 'Введите корректные 4 цифры кода'
        },
        password: {
          required: 'Обязательное поле',
          minLength: 'Минимальная длина пароля - 6 символов'
        },
        'repeat-password': {
          required: 'Обязательное поле',
          minLength: 'Минимальная длина пароля - 6 символов',
          function: 'Пароли не совпадают'
        }
      }
    });

    const phone1 = new window.JustValidate('#register-phone-check', {
      colorWrong: '#ec1818',
      rules: {
        tel: {
          required: true,
          function: (name, value) => {
            const phone = selector.inputmask.unmaskedvalue()
            return Number(phone) && phone.length === 10
          }
        }
      },
      messages: {
        tel: {
          required: 'Укажите ваш телефон',
          function: 'Номер указан неверно'
        }
      }
    });

    fetchCodeBtn.forEach(function (elem) {
      elem.addEventListener('click', function (ev) {
        document.getElementById('msg-error').innerHTML = '';
        const phoneNumber = '7' + selector.inputmask.unmaskedvalue();

        ev.preventDefault();
        phone1.result = [];
        phone1.getElements();

        if (!phone1.promisesRemote.length) {
          if (phone1.isValidationSuccess) {
            // phone1.validationSuccess();
            fetch('http://192.168.0.244:8080/getRegisterCode?phone=' + phoneNumber)
              .then(res => {
                switch (res.status) {
                  case 204: {
                    document.getElementById('msg-error').innerHTML = '<span class="msg-error__text">Данный номер уже зарегистрирован.</span> <a class="link" href="/restore">Восстановить пароль?</a>';
                    break;
                  }
                  case 200: {
                    document.querySelector('.msg-warning__text').style.display = 'none';
                    document.getElementById('register-code-button').style.display = 'none';
                    document.querySelector('.register__code-submit').style.display = 'block';
                    break;
                  }
                  default: {
                    document.getElementById('msg-error').innerHTML = '<span class="msg-error__text">Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.</span>';
                  }
                }
              })
              .catch(error => {
                console.log(error)
              });
          } else {
            phone1.validationFailed();
          }
          return;
        }
      })

      Promise.all(phone1.promisesRemote).then(() => {
        phone1.promisesRemote = [];

        if (phone1.isValidationSuccess) {
          // phone1.validationSuccess();
          fetch('http://192.168.0.244:8080/getRegisterCode?phone=' + phoneNumber)
            .then(res => {
              if (res.status === 200) {
                document.querySelector('.msg-warning__text').style.display = 'none';
                document.getElementById('register-code-button').style.display = 'none';
                document.querySelector('.register__code-submit').style.display = 'block';
              }
            })
            .catch(error => console.log(error));
        } else {
          phone1.validationFailed();
        }
      });
    });
  }

  if (document.querySelector('.my__form')) {
    const selector = document.querySelector("input[type='tel']");
    // const im = new Inputmask("+7 (999) 999-99-99");
    phoneMask.mask(selector);

    new window.JustValidate('.my__form', {
      colorWrong: '#ec1818',
      rules: {
        firstName: {
          maxLength: 50
        },
        tel: {
          required: true,
          function: (name, value) => {
            const phone = selector.inputmask.unmaskedvalue()
            return Number(phone) && phone.length === 10
          }
        },
        password: {
          minLength: 6
        },
        'repeat-password': {
          minLength: 6,
          function: (name, value) => {
            return value === document.querySelector('#password').value;
          }
        }
      },
      messages: {
        firstName: {
          maxLength: '- Максимальная длина имени - 50 символов'
        },
        tel: {
          required: '- Обязательное поле',
          function: '- Номер указан неверно'
        },
        password: {
          minLength: '- Минимальная длина пароля - 6 символов'
        },
        'repeat-password': {
          minLength: '- Минимальная длина пароля - 6 символов',
          function: '- Пароли не совпадают'
        }
      }
    });
  }

  // Total request calculator
  if (document.getElementById('request-total')) {
    const cost = document.getElementById('request-cost');
    const count = document.getElementById('request-count');
    const total = document.getElementById('request-total');
    const elements = [cost, count];

    elements.forEach(elem => {
      elem.addEventListener('input', () => {
        total.innerHTML = Number(cost.value) * Number(count.value);
      })
    });
  }
});
