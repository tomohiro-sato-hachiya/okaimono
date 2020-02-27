<template>
  <div>
    <h1>okaimono</h1>
    <button type="button" @click="doLogin">{{loginMessage}}</button>
    <p>ユーザ名: {{userName}}</p>
    <div v-if="logined">
        <inputArea :nextItemId="nextItemId" @addItem="addItem"/>
        <h2>未購入リスト</h2>
        <div v-for="undone in undoneList">
            <Item :itemName="undone.dynamicItemName" :number="undone.dynamicNumber" :itemId="undone.itemId" :boughtFlg="undone.dynamicBoughtFlg" @change="change" @bought="bought" @removeItem="removeItem" />
        </div>
        <h2>購入済みリスト</h2>
        <div v-for="done in doneList">
            <Item :itemName="done.dynamicItemName" :number="done.dynamicNumber" :itemId="done.itemId" :boughtFlg="done.dynamicBoughtFlg" @change="change" @removeItem="removeItem" />
        </div>
    </div>
  </div>
</template>

<script>
import InputArea from '~/components/inputArea.vue'
import Item from '~/components/item.vue'
import Vue from 'vue'
import firebase from '~/plugins/firebase.js'

const ItemConstructor = Vue.extend(Item);

export default {
  components: {
      InputArea,
      Item,
  },
  data: function() {
      return {
  		  undoneList: [],
  		  doneList: [],
  		  loginMessage: 'ログインする',
  		  userName: '',
  		  logined: false,
  		  user: null,
  		  nextItemId: 0,
      };
  },
  methods: {
      addItem: function(item) {
          firebase.database().ref('item/' + this.getKey(item)).set(this.getData(item));
          this.undoneList.push(item);
          this.nextItemId++;
      },
      bought: function(item) {
          item.dynamicBoughtFlg = true;
          firebase.database().ref('item/' + this.getKey(item)).set(this.getData(item));
          let undoneListLength = this.undoneList.length;
          for (let index = 0; index < undoneListLength; index++) {
              let undone = this.undoneList[index];
              if (undone.itemId === item.itemId) {
                  this.undoneList.splice(index, 1);
                  undone.$destroy();
                  break;
              }
          }
          this.doneList.push(item);
      },
      change: function(item) {
          console.log(item.dynamicNumber);
          firebase.database().ref('item/' + this.getKey(item)).set(this.getData(item));
      },
      removeItem: function(item) {
          firebase.database().ref('item/' + this.getKey(item)).remove();
          let deleted = false;
          let undoneListLength = this.undoneList.length;
          let doneListLength = this.doneList.length;
          for (let index = 0; index < undoneListLength; index++) {
              let undone = this.undoneList[index];
              if (undone.itemId === item.itemId) {
                  this.undoneList.splice(index, 1);
                  deleted = true;
                  break;
              }
          }
          if (!deleted) {
              for (let index = 0; index < doneListLength; index++) {
                  let done = this.doneList[index];
                  if (done.itemId === item.itemId) {
                    this.doneList.splice(index, 1);
                    break;
            　  }
              }
          }
          item.$destroy();
      },
      doLogin: function() {
			if (firebase.auth().currentUser === null) {
				this.login();
			} else {
				this.logout();
			}
		},
		login: function() {
			let provider = new firebase.auth.GoogleAuthProvider();
			let self = this;
			firebase.auth().signInWithPopup(provider)
			.then(function(result) {
				self.user = result.user;
				self.userName = result.user.displayName;
				self.loginMessage = 'ログオフする';
				self.logined = true;
				window.alert('ログインしました');
				let db = firebase.database();
				let ref = db.ref('item');
				ref.orderByChild('uid').equalTo(self.user.uid)
				.once('value').then(function(snapshot) {
					if (firebase.auth().currentUser !== null) {
					    let dataList = snapshot.val();
						for (let index in dataList) {
						    let data = dataList[index];
						    let item = new ItemConstructor({
                              propsData: {
                                  itemName: data.itemName,
                                  number: data.number,
                                  itemId: data.itemId,
                                  boughtFlg: data.boughtFlg,
                              }
                            });
                            if (self.nextItemId <= data.itemId) {
                                self.nextItemId = data.itemId + 1;
                            }
                            let itemMount = item.$mount();
                            if (itemMount.dynamicBoughtFlg) {
                                self.doneList.unshift(itemMount);
                            } else {
                                self.undoneList.unshift(itemMount);
                            }
						}
					}
				});
			});
		},
		logout: function() {
			firebase.auth().signOut();
			this.userName = '';
			this.undoneList = [];
			this.doneList = [];
			this.loginMessage = 'ログインする';
			this.logined = false;
			window.alert('ログオフしました');
		},
		getKey: function(item) {
		    return this.user.uid + '_' + item.itemId;
		},
		getData: function(item) {
		    return {
		        uid: this.user.uid,
                itemName: item.dynamicItemName,
                number: item.dynamicNumber,
                itemId: item.itemId,
                boughtFlg: item.dynamicBoughtFlg,
            };
		}, 
  },
  created: function() {
      if (firebase.auth().currentUser === null) {
  	    this.login();
      }
  },
}
</script>