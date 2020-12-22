var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BPCBdl1bhm5itGJh6qq6FhSX60vS9DawwTa-jh9sOyWDcIpPdjq1FxZSMfcOkk8oOTvDJjoY_gJzDCroK3J3e48",
   "privateKey": "BHlKFkclwITdrv1isRrz9HeJ16cckp77yL--ANHlGJ8"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/cYIpXB4jl1k:APA91bG4rVLVkIwr41lYPLH_SbjLPaU8L_O_60SFBs-U6FTwf1_RIDwJQJ11k1-MHkSM2Sbk6uNLpVcO3t9gYg1L5_-OfMrZ2fhSqIj2cFNlfB16iFckeXExCgByzDZx4EOftSDT4NAL",
   "keys": {
       "p256dh": "BPGofXba1k7X7SSOlehJ31snKvnsKj1Kibxxk6ZMpDBjUiYYo2n29n9LMHpHWmEfUziBxpeABJNgQIqcbq/uog4=",
       "auth": "ZzBM9RXwZbqtue4Ip5GZvw=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '214526873031',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);