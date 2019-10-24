console.log('Hung');


const posts = async () => {
    try {
        const data = await fetch('https://jsonplaceholder.typicode.com/posts');
        const result = await data.json();
        console.log(result);
    } catch (error) {
        console.log(err);
    }
};

posts();