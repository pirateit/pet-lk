window.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('header')) {
    // Presets
    const profileMenuWidth = document.querySelector('.header__profile').offsetWidth;
    document.querySelector('.header__menu').style.width = profileMenuWidth + 'px';
    const headerHeight = document.querySelector('.header').offsetHeight;
    document.querySelector('.header__menu').style.top = headerHeight / 2 + 12 + 'px';
    if (document.body.clientWidth <= 992) {
      const navHeight = document.querySelector('.nav').offsetHeight;

      document.querySelector('.main').style.paddingBottom = navHeight + 'px';
    }

    // Profile Menu
    document.querySelector(".header__profile").addEventListener("click", function () {
      if (this.classList.contains("header__profile_active")) {
        this.classList.remove("header__profile_active");
      } else {
        this.classList.add("header__profile_active");
      }
    }, false);

    document.addEventListener("click", function (e) {
      let isClickInside = document.querySelector(".header__profile").contains(e.target);

      if (!isClickInside && document.querySelector(".header__profile_active")) {
        document.querySelector(".header__profile").classList.remove("header__profile_active");
      }
    }, false);
  }

  // Profile Delete
  if (document.querySelector('#profile-delete')) {
    const userId = document.querySelector('input[type="hidden"]').value;

    document.querySelector('#profile-delete').addEventListener('click', () => {
      document.querySelector('.delete__form').style.display = 'block';
    });

    document.querySelector('#delete-btn').addEventListener('click', () => {
      fetch('/users/' + userId, { method: 'DELETE', redirect: 'manual' })
        .then(res => {
          location.href = '/';
        })
        .catch(err => console.log(err));
    })
  }

  if (document.querySelector('#request__form')) {
    const costField = document.querySelector('#cost');
    const countField = document.querySelector('#count');
    const totalInputs = [document.querySelector('#cost'), document.querySelector('#count')];

    totalInputs.forEach(function (field) {
      field.addEventListener('input', function () {
        const total = costField.value * countField.value;

        document.querySelector('#total').value = total;
        document.querySelector('.request-data__total').innerHTML = total;
      });
    });
  }
});

// Forms
if (document.querySelector('.login__form')) {
  const selector = document.querySelector("input[type='tel']");
  const im = new Inputmask("+7 (999) 999-99-99");
  im.mask(selector);

  new window.JustValidate('.login__form', {
    rules: {
      tel: {
        required: true,
        function: (name, value) => {
          const phone = selector.inputmask.unmaskedvalue()
          return Number(phone) && phone.length === 10
        }
      },
      password: {
        required: true
      }
    },
    messages: {
      tel: {
        required: 'Обязательное поле',
        function: 'Номер указан неверно'
      },
      password: {
        required: 'Обязательное поле',
      }
    }
  });
}

if (document.querySelector('.register__form')) {
  const selector = document.querySelector("input[type='tel']");
  const im = new Inputmask("+7 (999) 999-99-99");
  im.mask(selector);
  const fetchCodeBtn = document.querySelectorAll('.register__btn-code');
  const phone2 = new window.JustValidate('.register__form', {
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

  const phone1 = new window.JustValidate('.register__phone-check', {
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
      document.querySelector('.msg-error').innerHTML = '';
      const phoneNumber = '7' + selector.inputmask.unmaskedvalue();

      ev.preventDefault();
      phone1.result = [];
      phone1.getElements();

      if (!phone1.promisesRemote.length) {
        if (phone1.isValidationSuccess) {
          // phone1.validationSuccess();
          fetch('http://localhost:8080/getRegisterCode?phone=' + phoneNumber)
            .then(res => {
              console.log(res.status)
              switch (res.status) {
                case 204: {
                  document.querySelector('.msg-error').innerHTML = '<span class="msg-error__text">Данный номер уже зарегистрирован.</span> <a class="login__link" href="/restore">Восстановить пароль?</a>';
                  break;
                }
                case 200: {
                  document.querySelector('.msg-info').style.display = 'none';
                  document.querySelector('.register__code-submit').style.display = 'block';
                  document.querySelector('.register__code-button').style.display = 'none';
                  break;
                }
                default: {
                  document.querySelector('.msg-error__text').innerHTML = 'Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.';
                }
              }
            })
            .catch(error => console.log(error));
        } else {
          phone1.validationFailed();
        }
        return;
      }
    })

    Promise.all(phone1.promisesRemote).then(function () {
      phone1.promisesRemote = [];

      if (phone1.isValidationSuccess) {
        // phone1.validationSuccess();
        fetch('http://localhost:8080/getRegisterCode?phone=' + phoneNumber)
          .then(res => {
            if (res.status === 200) {
              document.querySelector('.msg-info').style.display = 'none';
              document.querySelector('.register__code-submit').style.display = 'block';
              document.querySelector('.register__code-button').style.display = 'none';
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
  const im = new Inputmask("+7 (999) 999-99-99");
  im.mask(selector);

  new window.JustValidate('.my__form', {
    rules: {
      firstName: {
        maxLength: 32
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
        maxLength: 'Максимальная длина имени - 50 символов'
      },
      tel: {
        required: 'Обязательное поле',
        function: 'Номер указан неверно'
      },
      password: {
        minLength: 'Минимальная длина пароля - 6 символов'
      },
      'repeat-password': {
        minLength: 'Минимальная длина пароля - 6 символов',
        function: 'Пароли не совпадают'
      }
    }
  });
}
