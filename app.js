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

// Update these to match your Keycloak server and client
// or
// Place keycloak.json config file in web root and pass no config to Phasetwo()
const config = {
  realm: 'quickstart',
  url: 'http://localhost:8180/auth/',
  sslRequired: 'external',
  clientId: 'app-html5',
  publicClient: true,
  confidentialPort: 0,
};

const p2 = new Phasetwo(config);

// exposing globally for ease of console debugging
window.p2 = p2;
const serviceUrl = 'http://localhost:3000/service';

window.notAuthenticated = function notAuthenticated() {
  document.getElementById('not-authenticated').style.display = 'block';
  document.getElementById('authenticated').style.display = 'none';
};

window.authenticated = function authenticated() {
  document.getElementById('not-authenticated').style.display = 'none';
  document.getElementById('authenticated').style.display = 'block';
  document.getElementById('message').innerHTML = 'User: ' + p2.tokenParsed['preferred_username'];
};

window.request = function request(endpoint) {
  var req = function () {
    var req = new XMLHttpRequest();
    var output = document.getElementById('message');
    req.open('GET', serviceUrl + '/' + endpoint, true);

    if (p2.authenticated) {
      req.setRequestHeader('Authorization', 'Bearer ' + p2.token);
    }

    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if (req.status == 200) {
          output.innerHTML =
            'Message (from server): <pre>' + JSON.stringify(JSON.parse(req.responseText).message, null, 2) + '</pre>';
        } else if (req.status == 0) {
          output.innerHTML = '<span class="error">Request failed</span>';
        } else {
          output.innerHTML = '<span class="error">' + req.status + ' ' + req.statusText + '</span>';
        }
      }
    };

    req.send();
  };

  if (p2.authenticated) {
    var promise = p2.updateToken(30);
    if (!promise.then) {
      promise.then = promise.success;
    }
    promise.then(req);
  } else {
    req();
  }
};

window.onload = function () {
  var promise = p2.init({ onLoad: 'check-sso', checkLoginIframeInterval: 1 });
  if (!promise.then) {
    promise.then = promise.success;
  }
  promise.then(function () {
    if (p2.authenticated) {
      authenticated();
    } else {
      notAuthenticated();
    }

    document.body.style.display = 'block';
  });
};

// Requests account information via API request directly to Keycloak server
// rather than through intermediate service layer
window.getAccount = async function () {
  const output = document.getElementById('message');
  try {
    const ret = await p2.accountApi().get(p2.token);
    output.innerHTML = 'Message (from client): <pre>' + JSON.stringify(ret, null, 2) + '</pre>';
  } catch (err) {
    const message = err.message ? err.message : err;
    output.innerHTML = '<span class="error">Request failed:' + message + '</span>';
  }
};

p2.onAuthLogout = notAuthenticated;
