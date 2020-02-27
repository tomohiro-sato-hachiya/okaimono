<template>
	<div>
		<Input showMessage="新規登録" :itemName="itemName" :number="number" :clearFlg="true" @submit="addItem" />
	</div>
</template>

<script>
import Item from '~/components/item.vue'
import Vue from 'vue'
import Input from '~/components/input.vue'

const ItemConstructor = Vue.extend(Item);

export default {
  components: {
  	Item,
  	Input,
  },
  props: {
  	nextItemId: Number,
  },
  data: function() {
  	return {
  		itemName: '',
  		number: 1,
  		isHidden: true,
  	};
  },
  methods: {
  	addItem: function(value) {
  		this.itemName = value.itemName;
  		this.number = value.number;
  		let item = new ItemConstructor({
  			propsData: {
  				itemName: this.itemName,
  				number: Number(this.number),
  				itemId: this.nextItemId,
  				boughtFlg: false,
  			}
  		});
  		this.isHidden = true;
  		this.$emit('addItem', item.$mount());
  		this.itemName = '';
  		this.number = 1;
  	},
  },
}
</script>