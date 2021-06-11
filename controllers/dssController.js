"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");
const kriteria = require('../models/kriteria');
const rumah = require('../models/rumah');

 async function getKriteria (){
  return await models.kriteria.findAll({
      attributes :['nama_kriteria'],
      raw:true
    });
 }

  async function makepairwise(){
  let result = [];
  let init = await getKriteria();
  let kriteria = init.map(element => {
    return element.nama_kriteria;
  });
  console.log(kriteria);
  //const kriteria = ["lokasi","desain","fasilitas"]; 

  for(let i=0;i<kriteria.length;i++){
    for(let j=0;j<kriteria.length;j++){
      if(i == j){
        result.push({
          i:kriteria[i],
          j:kriteria[j],
          value:1
        })
      }else if (
        (result.findIndex(function(post, index) {
          if(post.i == kriteria[j] && post.j == kriteria[i] )
            return true;
        })) > 0
      ){
        result.push({
          i:kriteria[i],
          j:kriteria[j],
          value: 'hide'
        })
      }else{
        result.push({
          i:kriteria[i],
          j:kriteria[j],
          value: null
        })
      }
      //console.log(i+1,j+1);
    }
  }
  return result;
  //res.json(result);
}

  async function pairwisefill (value) {
  
  let pairwise = await makepairwise();
  console.log(pairwise);
  let init = await getKriteria();
  let kriteria = init.map(element => {
    return element.nama_kriteria;
  });

  for(let i= 0 ; i<value.length; i++){
      if (value[i] == "null"){
          pairwise[i].value=null;
      }else{
          pairwise[i].value=Number(value[i]);
      }
  }
  
  let index = 0

  for(let i=0;i<kriteria.length;i++){
      for(let j=0;j<kriteria.length;j++){
          if(pairwise[index].value == null){
              pairwise[index].value = 1/(pairwise.find((x) => x.i === kriteria[j] && x.j === kriteria[i]).value);
              console.log(1/(pairwise.find((x) => x.i === kriteria[j] && x.j === kriteria[i]).value));
          }
          index ++;
      }
  }
  return pairwise;
}


 async function calculateWeight (pairwise){
  let init = await getKriteria();
  let kriteria = init.map(element => {
    return element.nama_kriteria;
  });
  
  var x = [];
  var y = [];
  var data = [];
  var sumnormalisasi = [];
  var transpose = [];
  var weight = [];
  let index = 0;
  for(let i=0;i<kriteria.length;i++){
      for(let j=0;j<kriteria.length;j++){
          //console.log((i+1),(j+1));
          x.push(pairwise[index].value)
          index++;
      }
      y.push(x);
      x= [];
  }
  //get sum of x(kriteria)
  data = y 
  //console.log(hasil1)
  y = [];//megosongkan y

  let sum = data.map(element => element.reduce(function(a, b){
      return a + b;
  }, 0)); //mendapatkan nilai sum kriteria
  console.log("result = "+data,sum);
  
  //membagi dengan total nilai kriteria (normalisasi part1)
  for(let i=0;i<kriteria.length;i++){
      for(let j=0;j<kriteria.length;j++){
          data[i][j]=data[i][j]/sum[i];
      }
  }
  console.log(data);

  //ubah kolom jadi baris(transpose)
  for(let i=0;i<kriteria.length;i++){
      for(let j=0;j<kriteria.length;j++){
          //console.log((j+1),(i+1));
          x.push(data[j][i]);
      }
      y.push(x);
      x = [];
  }
  transpose = y;//tambah ke variable transpose
  y=[];
  console.log(transpose);

  sumnormalisasi = transpose.map(element => element.reduce(function(a, b){
      return a + b;
  }, 0));
  
  return weight = sumnormalisasi.map((x)=>{ return x/kriteria.length}).map((x)=>{ return parseFloat(x)})
  
}






async function getAlternatif(req,res) {
  let result = []; 
  let nama_alternatif = await models.alternatif.findAll({
    attributes : [],
    include : {model : models.rumah ,as:'id_rumah_rumah',attributes : ['id_rumah','nama_rumah','judul_iklan','alamat_lokasi','wilayah','harga','kamar_tidur','luas_bangunan','imgPath']},
  })
  for(let i = 0; i<nama_alternatif.length ; i++){
    await result.push(
      {
        id_rumah : nama_alternatif[i].id_rumah_rumah.id_rumah,
        nama_rumah : nama_alternatif[i].id_rumah_rumah.nama_rumah,
        judul_iklan : nama_alternatif[i].id_rumah_rumah.judul_iklan,
        alamat_lokasi : nama_alternatif[i].id_rumah_rumah.alamat_lokasi,
        wilayah : nama_alternatif[i].id_rumah_rumah.wilayah,
        harga : nama_alternatif[i].id_rumah_rumah.harga,
        kamar_tidur : nama_alternatif[i].id_rumah_rumah.kamar_tidur,
        luas_bangunan : nama_alternatif[i].id_rumah_rumah.luas_bangunan,
        imgPath : nama_alternatif[i].id_rumah_rumah.imgPath,
        hasil : null
      }
    )
  }
  return result;

}






async function vikor(weight) {
  let alternatif= await getAlternatif();

  //const fmax= [9,7,9];
  //const fmin= [3,1,1];

  
  //const weight= [0.45, 0.30, 0.05, 0.20];
  //normalisasi
  

  let data1 = 
  (await models.alternatif.findAll({
      attributes : ['alternatif_value'],
      raw : true
    })).map((x)=>{return x.alternatif_value});
    console.log("data1 = "+ data1);

    var data = []; 
    var fmax = [];
    var fmin = [];
    for (var i=0; i<data1[0].length; i++){
        for (var j=0; j<data1.length; j++){
           //console.log((data1[j][i]));
           data.push(data1[j][i]);
        }
        //console.log(data);
        fmax[i] = Math.max.apply(null,data);
        fmin[i] = Math.min.apply(null,data);
        data = [];
    }
    console.log("fmax = "+fmax+" dan fmin = "+fmin)
    console.log(data1[0].length,data1.length);

  for (var i=0; i<data1[0].length; i++){
      for (var j=0; j<data1.length; j++){
          console.log("j "+(j+1),"i "+(i+1));
          console.log("(("+fmax[i]+"-"+data1[j][i]+")"+"/"+"("+fmax[i]+"-"+fmin[i]+")) *"+weight[i]);
          var normalisasi = ((fmax[i]-data1[j][i])/(fmax[i]-fmin[i]))*weight[i];
          //fix nan
          if (isNaN(normalisasi)){
            normalisasi =0;
          }


          data1[j][i]=normalisasi;
          console.log("normalisasi = "+normalisasi);

      }
  }
  console.log (data1);
  
  //utility measures S
  var S = data1.map(element => element.reduce(function(a, b){
      return a + b;
  }, 0));
  console.log ("S = "+S);

  //Regret Measures R
  var R = data1.map(element => Math.max.apply(null,element));
  console.log("R = "+R);

  //menghitung indeks vikor
  //mencariS+
  var Splus = Math.max.apply(null,S);
  console.log("S+ = "+Splus);

  //mencari S-
  var Smin = Math.min.apply(null,S);
  console.log("S- = "+Smin);

  //mencariR+
  var Rplus = Math.max.apply(null,R);
  console.log("R+ = "+Rplus);

  //mencari S-
  var Rmin = Math.min.apply(null,R);
  console.log("R- = "+Rmin);

  //mencari indeks Q
  var Q = [];
  var V = 0.5;
  for (var i=0; i<S.length; i++){
      var result = V*((S[i]-Smin)/(Splus-Smin))+(1-V)*((R[i]-Rmin)/(Rplus-Rmin));
      //tambahan jika result 0/0 maka nan handle dengan return 0
      if(isNaN(result)){result = 0}; 
      console.log("qresult = "+result);
      Q.push(result);
  }
  console.log("Q = "+Q);

  //menuliskan hasil q ke JSON
  for (var i=0; i<Q.length; i++){
      alternatif[i].hasil = Q[i];
  }
  console.log(alternatif);

  //test alternatif1
  let alternatif1 = alternatif.sort((a,b) => a.hasil-b.hasil);


  //mendapatkan kolom kriteria
  let kriteria = (await models.kriteria.findAll({
    attributes : ['nama_kriteria']
  })).map((x)=>{return x.nama_kriteria});


  
  let json = {
    weight : weight,
    kriteria : kriteria,
    alternatif : alternatif1,
    unsortedalternatif : alternatif,
    fmax : fmax,
    fmin : fmin,
    normalisasi : data1,
    S : S,
    R : R,
    Splus : Splus,
    Rplus : Rplus,
    Smin : Smin,
    Rmin : Rmin,
    Q : Q
}
  return json
} 

  async function resultPost(req,res,result){
    return await models.pelanggan.update(
      {result : result},
      {where : {
        email : req.session.name
      }}
    ).then(()=>{
      req.session.error = "sukses"
    })
  }

  async function getResult(req,res){
    let result = await models.pelanggan.findOne({where : {
      email : req.session.name
    },
    attributes : ['result'],
    raw : true
  })
    return result;
  }

module.exports = {makepairwise,pairwisefill,calculateWeight,getAlternatif,vikor,resultPost,getResult};