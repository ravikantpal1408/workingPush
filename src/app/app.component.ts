import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AlertController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';




import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

// import { Toast } from '@ionic-native/toast';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private push: Push,
    public alertCtrl: AlertController,
    private backgroundMode: BackgroundMode,
    public toastCtrl: ToastController
    // private toast: Toast
  ) {
    this.backgroundMode.enable();

    this.initializeApp();
    this.chechBackgroundModeIsActive();
    this.pushSetup();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  chechBackgroundModeIsActive() {

    if (this.backgroundMode.isEnabled()) {
      alert("back ground active")
      console.log('Background is active')
    }
    else {
      alert("Not Active");
      console.log('Background is not active')
      this.backgroundMode.enable();

    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  pushSetup() {
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications', res);
        } else {
          console.log('We do not have permission to send push notifications', res);
        }

      });

    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    // this.push.createChannel({
    //   id: "testchannel1",
    //   description: "My first test channel",
    //   // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
    //   importance: 3
    // }).then(() => console.log('Channel created'));

    // Delete a channel (Android O and above)
    // this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

    // Return a list of currently configured channels
    // this.push.listChannels().then((channels) => console.log('List of channels', channels))

    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID: '1086571478955',
        // sound: 'true'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      }
    };

    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe(
      (notification: any) => {
        console.log('Received a notification', notification);
        if (notification.additionalData.foreground) {
          let confirmAlert = this.alertCtrl.create({
            title: 'New Notification',

            message: notification.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                console.log(notification.message);
                // this.nav.push(DetailsPage, { message: data.message });
              }
            }]

          });
          confirmAlert.present();

        }
        else {
          // this.nav.push(DetailsPage, { message: data.message });

          console.log('Push notification clicked');
          this.presentToast();
          // alert('ok i am clicked')

        }

      }
    );

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
