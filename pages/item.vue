<template>
	<div>
		<h3>{{dynamicItemName}}</h3>
		<p>{{dynamicNumber}}個</p>
		<div v-if="!dynamicBoughtFlg">
			<button @click="bought">購入済み</button>
			<Input showMessage="変更" :itemName="dynamicItemName" :number="dynamicNumber" :clearFlg="false" @submit="change" />
		</div>
		<button @click="deleteItem">削除</button>
	</div>
</template>

<script>
import Input from '~/pages/input.vue'

export default {
  components: {
  	Input,
  },
  props: {
  	itemName: String,
  	number: Number,
  	itemId: Number,
  	boughtFlg: Boolean,
  },
  data: function() {
  	return {
  		dynamicItemName: '',
  		dynamicNumber: 1,
  		dynamicBoughtFlg: false,
  	};
  },
  methods: {
  	bought: function() {
  		this.$emit('bought', this);
  	},
  	deleteItem: function() {
  		this.$emit('removeItem', this);
  	},
  	showInput: function() {
		this.isHidden = false;
  	},
  	change: function(value) {
  		this.dynamicItemName = value.itemName;
  		this.dynamicNumber = value.number;
  		this.$emit('change', this);
  		this.isHidden = true;
  	},
  },
  created: function() {
  	this.dynamicItemName = this.itemName;
  	this.dynamicNumber = this.number;
  	this.dynamicBoughtFlg = this.boughtFlg;
  },
}
</script>