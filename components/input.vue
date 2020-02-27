<template>
<div>
	<button type="button" @click="showInput">{{showMessage}}</button>
	<div v-bind:class="{ hiddenArea: isHidden }">
		<h2>情報を入力してください</h2>
		<input type="text" v-model="dynamicItemName" placeholder="品名"/>
		<br/>
		<input type="number" v-model="dynamicNumber" min="1" placeholder="個数"/>個
		<br/>
		<button type="button" @click="submit">送信</button>
		<button type="button" @click="cancel">キャンセル</button>
</div>
</div>
</template>

<script>
export default {
  props: {
  	showMessage: String,
  	itemName: String,
  	number: Number,
  	clearFlg: Boolean,
  },
  data: function() {
  	return {
  		dynamicItemName: '',
  		dynamicNumber: 1,
  		previousItemName: '',
  		previousNumber: 0,
  		isHidden: true,
  	};
  },
  methods: {
  	showInput: function() {
		this.isHidden = false;
  	},
  	submit: function() {
  		this.dynamicNumber = Number(this.dynamicNumber);
  		if (this.dynamicNumber <= 0) {
  			this.dynamicNumber = 1;
  		}
  		this.$emit('submit', {
  			itemName: this.dynamicItemName,
  			number: this.dynamicNumber,
  		});
  		if (this.clearFlg) {
  			this.dynamicItemName = '';
  			this.previousItemName = '';
  			this.dynamicNumber = 1;
  			this.previousNumber = 1;
  		} else {
  			this.previousItemName = this.dynamicItemName;
  			this.previousNumber = this.dynamicNumber;
  	    }
  		this.isHidden = true;
  	},
  	cancel: function() {
  		this.isHidden = true;
  		if (this.clearFlg) {
  			this.dynamicItemName = '';
  			this.dynamicNumber = 1;
  		} else {
  			this.dynamicItemName = this.previousItemName;
  			this.dynamicNumber = this.previousNumber;
  		}
  	},
  },
  created: function() {
  	this.dynamicItemName = this.itemName;
  	this.previousItemName = this.dynamicItemName;
  	this.dynamicNumber = this.number;
  	this.previousNumber = this.dynamicNumber;
  	this.dynamicBoughtFlg = this.boughtFlg;
  },
}
</script>

<style>
.hiddenArea {
	display: none;
}
</style>