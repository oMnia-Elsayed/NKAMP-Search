

window.fbAsyncInit = function () {
  FB.init({
    appId: '2129960467315363',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.2'
  });
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src =
    'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=2129960467315363&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function sharePostToFaceBook(pageUrl, postTitle, postDescription, postImage) {
  // postImage :: image  src without location of site
  FB.ui({
    method: 'share_open_graph',
    action_type: 'og.shares',
    action_properties: JSON.stringify({
      object: {
        'og:url': pageUrl,
        'og:title': postTitle,
        'og:description': postDescription,
        'og:image': postImage
      }
    })
  },
    function (response) {
      // Action after response
      if (response && response.post_id) {
      } else {
      }
    });
}


function shareContent(pcontent) {
  IN.API.Raw("/people/~/shares?format=json")
    .method("POST")
    .body(pcontent)
    .result(onSuccess)
    .error(onError);
}
