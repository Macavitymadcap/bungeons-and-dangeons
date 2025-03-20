const ws = new WebSocket('ws://localhost:3001');

ws.addEventListener('close', event => {
	setTimeout(() => {
		location.reload();
	}, 500);
});

ws.addEventListener('message', event => {
	if (event.data === 'reload') {
		location.reload();
	}
});
