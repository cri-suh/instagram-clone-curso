import { useEffect, useState} from 'react';
import firebase from 'firebase/compat/app';
import {auth,storage,db} from './firebase.js';

function Header(props){

  
  
  const [progress, setProgress] = useState(0);

  const [file, setFile] = useState(null);

  useEffect(()=>{


  }, [file, progress])

  function criarConta(e){
    
    e.preventDefault();
    let email = document.getElementById('email-cadastro').value;
    let username = document.getElementById('username-cadastro').value;
    let senha = document.getElementById('senha-cadastro').value;

    //criar conta firebase;
    auth.createUserWithEmailAndPassword(email,senha)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName:username
      })
      alert('conta criada com sucesso!');
      let modal = document.querySelector('.modalCriarConta');
        modal.style.display = "none";
    }).catch((error)=>{
      alert(error.message);
    })
    ;

  }
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }
  

  function logar(e){
    e.preventDefault();
    let email = document.getElementById('email-login').value;
    let senha = document.getElementById('senha-login').value;


    auth.signInWithEmailAndPassword(email,senha)
    .then((auth)=>{
      props.setUser(auth.user.displayName);
      alert('logado com sucesso!');
      window.location.href = "/";
    }).catch((err)=>{
      alert(err.message);
    })

  }


  function abrirModalCriarConta(e){
    e.preventDefault();

    let modal = document.querySelector('.modalCriarConta');
    modal.style.display = "block";
    

}
  function abrirModalUpload(e){
    e.preventDefault();

    let modal = document.querySelector('.modalUpload');
    modal.style.display = "block";

  }

  function fecharModalCriar(){
    let modal = document.querySelector('.modalCriarConta');
    modal.style.display = "none";
  }
  function fecharModalUpload(){
    let modal = document.querySelector('.modalUpload');
    modal.style.display = "none";

  }
  function deslogar(e){
    e.preventDefault();
    auth.signOut().then(function(val){
        props.setUser(null);
        window.location.href = "/";
    })
  }

  function uploadPost(e){
    e.preventDefault();
    if(!file){
      alert('selecione um arquivo para continuar!');
      return;
    }
    let tituloPost = document.getElementById('titulo-upload').value;
    
    const uploadTask = storage.ref(`images/${file.name}`).put(file);

    uploadTask.on('state_changed', function(snapshot) {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100); 
      setProgress(progress);
    },function(error){
      console.log(error);

    }, function(){

        storage.ref('images').child(file.name).getDownloadURL()
        .then(function(url){
          db.collection('posts').add({
            titulo: tituloPost,
            image: url,
            userName: props.user,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });


          setProgress(0);
          setFile(null);


          alert('upload realizado com sucesso!');
          
          document.getElementById('form-Upload').reset();
          fecharModalUpload();

        });
      }
    );
  }
  
    
    return(



        <div className="header">

          <div className="modalCriarConta">
              <div className="formCriarConta">
                <div onClick={()=>fecharModalCriar()} className="close-modal-criar">x</div>
                <h2>Criar Conta</h2>
                  <form onSubmit={(e)=>criarConta(e)}>
                    <input id="email-cadastro" type="text" placeholder="Seu e-mal..." />
                    <input id="username-cadastro" type="text" placeholder="Seu username..." />
                    <input id="senha-cadastro" type="password" placeholder="Seu senha..." />
                    <input type="submit" value="Criar Conta!" />
                  </form>
              </div>
          </div>
          <div className="modalUpload">
              <div className="formUpload">
                <div onClick={()=>fecharModalUpload()} className="close-modal-criar">x</div>
                <h2>Fazer Upload</h2>
                  <form id="form-Upload" onSubmit={(e)=>uploadPost(e)}>
                    <progress id="progress-upload" value={progress} max="100"></progress>
                    <input id="titulo-upload" type="text" placeholder="Nome da sua foto..." required />
                    <input type="file" id="file" onChange={(e) => handleFileChange(e)} required />
                    <input type="submit" value="Postar no Insta!" />
                  </form>
              </div>
          </div>
          <div className="center">

            <div className="header_logo">
              <a href=''><img src="https://graffica.info/wp-content/uploads/instagram-old-600.jpg" /></a>
            </div>
            {
              (props.user)?
              <div className="header_logadoInfo">
                <span>Olá <b>{props.user}</b></span>
                <a onClick={(e)=>abrirModalUpload(e)} href="#">Postar!</a>
                <a onClick={(e)=>deslogar(e)}>Deslogar</a>
              </div>
              :
              <div className='header_loginForm'>
                <form onSubmit={(e)=>logar(e)}>
                  <input id="email-login" type="text" placeholder='Login...' />
                  <input id="senha-login" type="password" placeholder='Senha...' />
                  <input type='submit' name='acao' value='logar!' />
                </form>
                <div className="btn_criarConta">
                  <a onClick={(e)=>abrirModalCriarConta(e)} href="#">Criar Conta</a>
                </div>
            </div>
              
            }

            
            </div>
</div>


    )

}

export default Header;
