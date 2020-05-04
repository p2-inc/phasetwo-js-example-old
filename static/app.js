/*
 * JBoss, Home of Professional Open Source
 * Copyright 2016, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Phasetwo from 'phasetwo-js';

const config = {
  realm: 'quickstart',
  url: 'http://localhost:8180/auth/',
  sslRequired: 'external',
  clientId: 'app-html5',
  publicClient: true,
  confidentialPort: 0,
};

// var ph2 = new Keycloak();
var ph2 = new Phasetwo({ ...config, secretOption: 'hello' });
window.ph2 = ph2;
// var ph2 = new Phasetwo();
var serviceUrl = 'http://localhost:3000/service';

function notAuthenticated() {
  document.getElementById('not-authenticated').style.display = 'block';
  document.getElementById('authenticated').style.display = 'none';
}

function authenticated() {
  document.getElementById('not-authenticated').style.display = 'none';
  document.getElementById('authenticated').style.display = 'block';
  document.getElementById('message').innerHTML = 'User: ' + ph2.tokenParsed['preferred_username'];
}

function request(endpoint) {
  var req = function () {
    var req = new XMLHttpRequest();
    var output = document.getElementById('message');
    req.open('GET', serviceUrl + '/' + endpoint, true);

    if (ph2.authenticated) {
      req.setRequestHeader('Authorization', 'Bearer ' + ph2.token);
    }

    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if (req.status == 200) {
          output.innerHTML = 'Message: ' + JSON.parse(req.responseText).message;
        } else if (req.status == 0) {
          output.innerHTML = '<span class="error">Request failed</span>';
        } else {
          output.innerHTML = '<span class="error">' + req.status + ' ' + req.statusText + '</span>';
        }
      }
    };

    req.send();
  };

  if (ph2.authenticated) {
    var promise = ph2.updateToken(30);
    if (!promise.then) {
      promise.then = promise.success;
    }
    promise.then(req);
  } else {
    req();
  }
}

window.onload = function () {
  var promise = ph2.init({ onLoad: 'check-sso', checkLoginIframeInterval: 1 });
  if (!promise.then) {
    promise.then = promise.success;
  }
  promise.then(function () {
    if (ph2.authenticated) {
      authenticated();
    } else {
      notAuthenticated();
    }

    document.body.style.display = 'block';
  });
};

ph2.onAuthLogout = notAuthenticated;
