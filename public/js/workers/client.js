$(function() {

	if (window.Worker) {
		var workercode = '/js/workers/worker.js';
	
		$('#btn-rodar-codigo').prop('disabled', false);
		$('#btn-rodar-codigo').click();

		makeWorkerExecuteSomeCode('', function(answer) {
			console.log('Finalizou');
			console.log(answer);
		});
	}

	function makeWorkerExecuteSomeCode(code, callback) {
		var timeout;

		code = code + '';
		var worker = new Worker(workercode);

		worker.addEventListener('message', function(event) {
				clearTimeout(timeout);
				callback(event.data);
		});

		worker.postMessage({
				code: code
		});

		timeout = window.setTimeout( function() {
				callback('Maximum execution time exceeded');
				worker.terminate();
		}, 3000);
}
});