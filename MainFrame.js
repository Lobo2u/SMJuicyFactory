console.log(arguments[2][1]);
var ind=arguments[2][1];
console.log(typeof(ind));

let exi=$(Tab1.id).tabs("exists",ind);
console.log("존재 여부 : "+exi);

if(exi){
    $(Tab1.id).tabs("select",ind);
    Tab1.setPage(ind,ind,1);
}
else{
    $(Tab1.id).tabs("add",{title:ind,index:0,closable:true});
    Tab1.setPage(ind,ind,1);
    $(Tab1.id).tabs("select",ind);
}
