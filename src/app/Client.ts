export class Client {
    private eventSource: EventSource | null = null;
    private onDataCallback: (data: any) => void;
    private statusElement: HTMLElement | null;
    private dataElement: HTMLElement | null;

    constructor(onData: (data: any) => void) {
        this.onDataCallback = onData;
        this.statusElement = document.getElementById('status');
        this.dataElement = document.getElementById('data-display');
    }

    public connect(url: string) {
        // Connect to a Spring WebFlux SSE endpoint
        this.eventSource = new EventSource(url);

        this.eventSource.onopen = () => {
            console.log("WebFlux Connection Opened");
            if (this.statusElement) this.statusElement.innerText = "Connected";
            if (this.statusElement) this.statusElement.style.color = "#4ade80";
        };

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.updateUI(data);
                this.onDataCallback(data);
            } catch (e) {
                console.warn("Received non-JSON data:", event.data);
            }
        };

        this.eventSource.onerror = (err) => {
            console.error("WebFlux Stream Error", err);
            if (this.statusElement) this.statusElement.innerText = "Error / Reconnecting...";
            if (this.statusElement) this.statusElement.style.color = "#ef4444";
        };
    }

    private updateUI(data: any) {
        if (this.dataElement) {
            this.dataElement.innerText = JSON.stringify(data);
        }
    }

    public mockDataStream() {
        // Simulates a WebFlux stream if no backend is running
        setInterval(() => {
            const mockData = {
                value: Math.random(), // Random intensity 0.0 - 1.0
                timestamp: Date.now()
            };
            this.updateUI(mockData);
            this.onDataCallback(mockData);
        }, 1000); // 1 update per second
    }
}