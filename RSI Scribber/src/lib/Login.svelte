    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Custome Class -->
    <link rel="stylesheet" href="style.css" />
    <title>Rsystems Application</title>
<script lang="ts">
import { store } from "./localStore";

    function login(){
        console.log('Login called.');
        // var openehr = "http://localhost:8080/ehrbase/rest/openehr/v1"
        // var ehrscape = "http://localhost:8080/ehrbase/rest/ecis/v1"
        var openehr = ""
        var ehrscape = ""
        var username = document.getElementById("uname").value;
        var password = ""
        var patientName = "";
        var dob = "";
        var ehrId = "";
        store.setLocal(JSON.stringify({ openehr, ehrscape, username, password, ehrId, patientName, dob}))
        console.log('Saved. --->', document.getElementById("uname").value);
        window.location.replace("/");
    }
</script>
<body>
    <section class="loginWrap">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-xl-10">
                    <div class="card rounded-0">
                        <div class="row image-reverse">
                            <div class="col-lg-6">
                                <div class="card-body p-md-5 mx-md-4">
                                    <div class="login-logo mb-3">
                                        <img src="login-logo.JPG" alt="logo" />                                        
                                    </div>
                                    <h5 class="mt-1 mb-3 pb-1">RSI EHR Login</h5>
                                    <!-- <form> -->
                                        <div class="form-outline mb-3">
                                            <label class="form-label">Username</label>
                                            <input type="text" class="form-control" placeholder="" name="uname" id ="uname">
                                        </div>

                                        <div class="form-outline mb-3">
                                            <label class="form-label">Password</label>
                                            <input type="password" class="form-control" placeholder="">
                                        </div>

                                        <div class="text-center pt-1 mt-4">
                                            <button id="login" class="btn loginBtn" type="button" on:click={login}>Login</button>
                                        </div>
                                    <!-- </form> -->

                                </div>
                            </div>
                            <div class="col-lg-6 d-flex align-items-center loginbg">
                                <div class="text-white px-3 py-4">
                                    <h4>RSI <span>EHR</span></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"></script>
</body>
