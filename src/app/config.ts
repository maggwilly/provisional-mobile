import { Component } from '@angular/core';

@Component({})
export class Config {

	// url of the chat server
	// for local development it will be something like http://192.168.0.214:9000/
	public static server = 'http://localhost:8000';
}
