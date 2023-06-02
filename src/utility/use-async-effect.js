const { useEffect} = require('react');
	

const useAsyncEffect = (effect, destroy, inputs) => {
    const hasDestroy = typeof destroy === 'function';
	

	useEffect(
        () => {
	      let result;
	      let mounted = true;
	

	      const maybePromise = effect(() => mounted);
	

	      Promise.resolve(maybePromise).then(value => {
	        result = value;
	      });
	

	      return () => {
	        mounted = false;
	

	        if (hasDestroy) {
	          destroy(result);
	        }
	      };
	    },
		// eslint-disable-next-line
	    hasDestroy ? inputs : destroy
	  );
};
	

module.exports = useAsyncEffect;
module.exports.useAsyncEffect = useAsyncEffect;
