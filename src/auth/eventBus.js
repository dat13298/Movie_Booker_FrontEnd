import mitt from "mitt";      // hoặc:  const emitter = { on: ()=>{}, ... }

const emitter = mitt();
export default emitter;
