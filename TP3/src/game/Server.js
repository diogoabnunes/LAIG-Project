class Server {
    constructor() {
        this.port = 8000;
    }

    onSuccesss(data) {
        console.log(data.target.response);
    }
    onError(data) {
        console.log("Error waiting for response");
    }

    makeRequest(requestString, onSuccess) {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+this.port+'/'+requestString, true);

        request.onload = onSuccess;
        request.onerror = this.onError;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
    }
}