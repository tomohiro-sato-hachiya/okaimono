import firebase from 'firebase'

var firebaseConfig = {
  // TODO: Firebase 構成オブジェクトを記載
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export default firebase