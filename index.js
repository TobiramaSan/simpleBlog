// const loadPostsByRestButton = documents.getElementById('wp-learn-rest-api-button');
// if (loadPostsByRestButton){
//     loadPostsByRestButton.addEventListener('click', function(){
//         const allPost = new wp_api_collection.Posts();
//         allPost.fetch().done(
//             function(posts){
//                 const textarea = document.getElementById('wp-learn-posts');
//                 posts.forEach(function(posts){
//                     textarea.value += posts.title.rendered +"\n";
//                 })
//             }
//         )
//     })
// }

// // clear the text area button
// const clearPostButton = document.getElementById('wp-learn-clear-posts');
// if (clearPostButton) {
//     clearPostButton.addEventListener('click', function(){
//         const textarea = document.getElementById('wp-learn-posts')
//         textarea.value = ''
//     });
// }

$(document).ready(function () { 
    var rootUrl = 'https://wordpress-restapi-demo.000webhostapp.com/'; 
    /**
    * wordpress url to retrieve all posts from our blog
    */
    const url = `${rootUrl}/wp-json/wp/v2/posts`; 
    /**
    * wordpress url used to retrieve a token for authentication
    */
    var tokenUrl = `${rootUrl}/wp-json/jwt-auth/v1/token`; 
    /**
    * in this custom scenario, we will be creating posts via admin 
    * access however in complex cases you should be able to register 
    * new users, the admin username and password is needed to retrieve 
    * a token which will be attached
    * as headers to subsequent requests for authentication
    */
    var adminDet = { 
    username: "Admin", 
    password: "Jesusisgood2me." 
    }; 
    /**
    * variable to store token retrived from the api
    */
    var token; 
    loadData(); 
    /**
    * ajax post request to retrieve the token once the app loads
    */
    $.post(tokenUrl, adminDet, 
    function (data, status) { 
    console.log("token: " + data.token); 
    token = data.token; 
    }); 
    /**
    * loadData() function makes a get request to retrieve 
    * all posts from the wordpress blog
    */
    function loadData() { 
    $.getJSON(url, function (data) { 
    console.log(data);
    /**
 * removes the spinner once a response is gotten from the api
 */
 $("#spinner").remove(); 
 /**
 * ensures that the div tag with id= mainDiv
 * is empty before appending innerHtml to it
 */
 $("#mainDiv").empty(); 
 /**reiterates through each list in the json oblect
 * while appending it to the div tag with id= mainDiv
 */
 for (var i = 0; i < data.length; i++) { 
 var div = document.createElement('div'); 
 div.innerHTML = `
 <div class="card pt-1">
 <div class="card-body">
 <h4 class="card-title">${data[i].title.rendered}</h4>
 <p class="card-text text-wrap">${data[i].content.rendered}</p>
 </div>
 </div>
 `; 
 $("#mainDiv").append(div); 
 }; 
 }); 
 } 
 /**
 * on form submission
 * submits the required parameters to create a new post in the
 * wordpress blog
 */
 $('form').submit(function (event) { 
 // stop the form from submitting the normal way and refreshing the page
 event.preventDefault(); 
 // get the form data
 // there are many ways to get this data using jQuery (you can use the class or id also)
 var formData = { 
 title: $('input[name=title]').val(), 
 content: $('textarea[name=content]').val(), 
 status: 'publish'
 };
 console.log(formData); 
 $.ajax({ 
 url: url, 
 method: 'POST', 
 data: JSON.stringify(formData), 
 crossDomain: true, 
 contentType: 'application/json', 
 headers: { 
 'Authorization': 'Bearer ' + token 
 }, 
 success: function (data) { 
 console.log(data); 
 /**
 * refreshes app-content to display latest posts
 */
 loadData(); 
 }, 
 error: function (error) { 
 console.log(error); 
 } 
 }); 
 }); 
 });