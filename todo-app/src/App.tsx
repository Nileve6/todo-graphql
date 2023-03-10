import React, { FC, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { print } from 'graphql';
import gql from 'graphql-tag';

const App: FC = () => {
	interface List{
		name: string,
		id: string,
	}
	interface User{
		username: string,
		role: string,
	}
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string>('');
	const [todoList, setTodoList] = useState<List[]>([]);
	const [todo, setTodo] = useState<string>('');
	const [editItem, setEditItem] = useState<string>('');
	const backend_url : string = `http://localhost:5000/graphql`;
	document.title = 'ToDo App';

	useEffect(()=>{
		getData()
	},[])

	function getData(){
		fetch(backend_url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				query: `{
					getAllTodos {
						id
						name
					}
				}`
			})
		})
		.then(res => res.json())
		.then(res => {
			console.log(res.data)
			setTodoList(res.data.getAllTodos)
		});
	}

	// eslint-disable-next-line @typescript-eslint/typedef
	const add = (item: string, isEdit: string) => {
		event?.preventDefault
		let itemId: string = (todoList.length + 1).toString();
		if(isEdit){
			itemId = isEdit;
			const newTodo: List = {
				name: item,
				id: itemId,
			}
					// eslint-disable-next-line @typescript-eslint/typedef
			const TODO = gql`
			mutation updateTodo($id:String!, $name:String!) {
			updateTodo(id:$id, name:$name) { 
				id
				name
			}
			}
			`;
			axios.post(backend_url, 
				{
					query: print(TODO),
					variables: {
						id: newTodo.id,
						name: newTodo.name,
					},
					headers: { Authorization: `Bearer ${token}` }
				})
			.then(response => {
				console.log(response.data)
				//setTodoList(response.data)
			})
		}else{
			const newTodo: List = {
				name: item,
				id: itemId,
			}
			console.log(newTodo)
			console.log(token)

			// eslint-disable-next-line @typescript-eslint/typedef
			const TODO = gql`
			mutation createTodo($id:String!, $name:String!) {
			  createTodo(id:$id, name:$name) { 
				id
				name
			  }
			}
			`;
			
			axios.post(backend_url, {
				query: print(TODO),
				variables: {
					id: newTodo.id,
					name: newTodo.name,
				},
				headers: { Authorization: `Bearer ${token}` }
			})
			.then(res => console.log(res))
			.catch(err => console.log(err))
				//setTodoList(res.data.getAllTodos)
		}

		setEditItem('');
	}
	function edit(item: List){
		setTodo(item.name);
		setEditItem(item.id)
	}
	async function remove(item: List) {
		// eslint-disable-next-line @typescript-eslint/typedef
		const TODO = gql`
			mutation deleteTodo($id:String!) {
				deleteTodo(id:$id) { 
					id
				}
			}
		`;
		axios.post(backend_url, 
			{
				query: print(TODO),
				variables: {
					id: item.id
				},
				headers: { Authorization: `Bearer ${token}` }
			})
		.then(response => {
			console.log(response.data)
			//setTodoList(response.data)
		})
	}
	function logging(user: User | null){
		if(!user){
			axios.post(`http://localhost:5000/login`, {username: 'Admin'})
			.then(response => {
				console.log(response.data.accessToken);
				setToken(response.data.accessToken);
			})
			setUser({ username: 'Admin', role: 'admin'});
			console.log(user)
		}
		if(user){
			setUser(null);
			console.log(user)
		}
	}
	return (
		<div className="App">
			<h1>ToDo App</h1>
			<section>
				<p></p>
				<button onClick={() => logging(user)}>{!user ? 'Login' : 'Logout'}</button>
			</section>
			<section>
				{ /*user?.role === 'admin' && */
					<form>
						<input value={todo} onChange={(event) => setTodo(event.target.value)} />
						<button id='add' onClick={() => add(todo, editItem)}>{!editItem ? 'Add' : 'Update'}</button>
					</form>
				}		
			</section>
			<section>
				<ul>
					{todoList.map(item =>
						<li key={item.name}>
							<p>{item.name}</p>
							{/*user?.role === 'admin' && */
								<>
									<button className='edit' onClick={() => edit(item)}>Edit</button>
									<button className='remove' onClick={() => remove(item)}>Remove</button>
								</>
							}
						</li>
					)}
				</ul>
			</section>
		</div>
	);
}

export default App;
