import { UtilsService } from './../../providers/utils.service';
import { LoginPage } from './../login/login';
import { Md5 } from 'ts-md5/dist/md5';
import { UserService } from './../../providers/user.service';
import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {
  userId: any;
  user: any;
  result: any;
  query: any = {
    "project": "spics",
    "table": "User",
    "order": {
      "name": "asc"
    },
    "start": 0,
    "length": 10,
    "columns": [
      "id",
      "name",
      "phone",
      "idCard",
      "creator",
      "login",
      "password",
      "auditStatus",
      "createTime"
    ],
    "filter": {
      "login": {
        "eq": ""
      },
      "password": {
        "eq": ""
      }
    }
  };

  update: any = {
    "project": "spics",
    "table": "User",
    "id": "",
    "fields": {
      "password": ""
    }
  };

  account: { confirm_password: string, old_password: string, new_password: string } = {
    confirm_password: '',
    old_password: '',
    new_password: ''
  };

  constructor(public navCtrl: NavController, public userService: UserService, public utilsService: UtilsService, ) {

  }

  doUpdate() {
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.query.filter.login.eq = this.user.login;
    this.query.filter.password.eq = Md5.hashStr(this.account.old_password).toString();
    this.userService.getUser(this.query).then(data => {
      this.result = data;
      if (this.result.length == 0) {
        this.utilsService.showError('原密码输入错误!');
        return;
      }
      this.userId = this.result[0].id;
      if (this.account.new_password != this.account.confirm_password) {
        this.utilsService.showError('密码输入不一致!');
        return;
      }

      this.update.id = this.userId;
      this.update.fields.password = Md5.hashStr(this.account.new_password).toString()
      this.userService.updatePassword(this.update).then(data => {
        this.result = data;
        if (this.result.code != 0) {
          this.utilsService.showError('修改密码失败，请联系管理员!');
        } else {
          this.navCtrl.push(LoginPage);
        }
      });
    });





  }
}
