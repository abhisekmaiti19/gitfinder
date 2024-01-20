const button = document.querySelector('button');
const header = document.querySelector('header');
const form = document.querySelector('form.search-box');
const searchInput = document.querySelector('.param');
const loader = document.querySelector('.loader');
const loader2 = document.querySelector('.loader2');
const content = document.querySelector('.content');
const profile = document.querySelector('.container');
const perPage = document.querySelector('#perPage');
const pagination = document.querySelector('.pagination');

let username = null;
let count = 0;
let currentPage = 1;

loader.style.display = 'none';
profile.style.display = 'none';

perPage.addEventListener('change', () => {
	pagination.style.display = 'none';
	currentPage = 1;
	setRepos();
});

const loadPage = (i) => {
	currentPage = Number.parseInt(i);
	setRepos(i);
};
const setPagination = (count) => {
	pagination.innerHTML = '';
	for (let i = 1; i <= count; i++) {
		pagination.innerHTML += `<button class="pageno ${
			currentPage === i ? 'selected' : ''
		}" onclick="loadPage(${i})">${i}</button>`;
	}
};

const setRepos = (pageno = 1) => {
	const cards = document.querySelector('.cards');
	cards.innerHTML = '';
	loader2.style.display = 'flex';
	content.style.display = 'block';
	fetch(
		`https://api.github.com/users/${username}/repos?per_page=${perPage.value}&page=${pageno}`
	)
		.then((response) => {
			if (!response.ok) {
			}
			return response.json();
		})
		.then((repos) => {
			repos.forEach((repo) => {
				let tags = '';
				repo.topics.forEach(
					(topic) => (tags += '<div class="tag">' + topic + '</div>')
				);
				cards.innerHTML += `
                            <div class="card">
                                <h3>${repo.name}</h3>
                                <p>${
									repo.description
										? repo.description
										: 'No Description'
								}</p>
                                <div class="tags">
                                    ${tags}
                                    </div>
                                    </div>
                                    `;
			});
			loader2.style.display = 'none';

			const perPageVal = Number.parseInt(perPage.value);
			if (count > perPageVal) {
				let c = Number.parseInt(count / perPageVal);
				c += count % perPageVal > 0 ? 1 : 0;
				console.log(c);
				setPagination(c);
				pagination.style.display = 'flex';
			}
		})
		.catch((error) => {});
};

const setProfile = (userProfile) => {
	document
		.querySelector('.profile-pic')
		.setAttribute('src', userProfile.avatar_url);
	document.querySelector('.username').innerText = userProfile.name
		? userProfile.name
		: userProfile.login;
	document.querySelector('.bio').innerText = userProfile.bio
		? userProfile.bio
		: 'No Bio Found';
	document.querySelector('.nation').innerText = userProfile.location
		? userProfile.location
		: 'Not Specified';
	document.querySelector('.twitter-link').innerText =
		userProfile.twitter_username
			? userProfile.twitter_username
			: 'Not Specified';
	document.querySelector('.twitter-link').href = userProfile.twitter_username
		? userProfile.twitter_username
		: '#';
	document.querySelector('.github-link').innerText = userProfile.html_url;
	document.querySelector('.github-link').href = userProfile.html_url;
	document.querySelector('.repo-count').innerText = userProfile.public_repos;
	loader.style.display = 'none';
	profile.style.display = 'block';

	username = userProfile.login;
	count = userProfile.public_repos;
	setRepos();
};

const getUserDetails = (username) => {
	fetch(`https://api.github.com/users/${username}`)
		.then((response) => {
			if (!response.ok) {
				document.querySelector('.error').style.display = 'block';
				loader.style.display = 'none';
				throw new Error('Not Found');
			}
			return response.json();
		})
		.then((userProfile) => {
			console.log(`GitHub profile of ${username}:`, userProfile);
			setProfile(userProfile);
		})
		.catch((error) => {
			document.querySelector('.error').style.display = 'block';
		});
};

const search = (event) => {
	event.preventDefault();
	if (!header.classList.contains('transform-header'))
		header.classList.add('transform-header');

	const username = searchInput.value.trim();
	if (username.length > 0) {
		loader.style.display = 'flex';
		loader2.style.display = 'flex';
		content.style.display = 'none';
		profile.style.display = 'none';
		document.querySelector('.error').style.display = 'none';
		getUserDetails(username);
	}
};

form.addEventListener('submit', search);
