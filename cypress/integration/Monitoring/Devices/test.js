
describe("Check the correctness of the data", function () {


    it("test", () => {
       let a = new Date();

       var options = { month: 'long', day: 'numeric', year: '2-digit'};
          
          console.log(a.toLocaleDateString('ru-RU', options));

    })



})

