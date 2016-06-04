import requestFrame from 'request-frame';
const rAF = requestFrame('request');

export default function debounce(fn) {
    let queued = false;
    const wrapper = () => {
        fn();
        queued = false;
    };

    return {
        enqueue() {
            if(!queued) {
                rAF(wrapper);
                queued = true;
            }
        }
    }
}
