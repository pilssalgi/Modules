'use strict';

require('intersection-observer');
const assignIn = require('lodash/assignIn');

export default class IntersectionObserve {
	constructor(option){
		this.config = {
			root:null, // scroll area, null = body
			rootMargin: '0px', // -100~100  px, %
  		threshold:0 // 0 ~ 100..n
		}

		assignIn(this.config,option);

	  const thresholds = [];
	  const numSteps = this.config.threshold;

	  for (let i=1.0; i<=numSteps; i++) {
	    let ratio = i/numSteps;
	    thresholds.push(ratio);
	  }

	  thresholds.push(0);

	  this.intersectionObsever = new IntersectionObserver((...arg)=>{this.onUpdate(...arg);},this.config);
	}

	onUpdate(entries,observer){
		// entries.forEach(function(entry) {
	  // 		entry.target
	  // 		if(entry.isIntersecting){
	  // 		
	  // 		}else{
	  // 		}
	  // 	}
	}

	add(dom){
		this.intersectionObsever.observe(dom);
	}
	
	remove(dom){
		this.intersectionObsever.unobserve(dom);
	}
}