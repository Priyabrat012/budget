 var budgetController=(function(){
   
    var Expense = function(id,description,value)
    {
      this.id=id;
      this.description=description;
      this.value=value;


    };
    var Income = function(id,description,value)
    {
      this.id=id;
      this.description=description;
      this.value=value;
    };

    calculateTotalSum=function(type)
    {

      var sum=0;
      data.allItems[type].forEach(function(current)
      {

        sum = sum + current.value;

      }

        );
       data.total[type] = sum;

    };

    var data={

      allItems: {

          exp: [],
          inc: []

      },
      total: {
        exp: 0,
        inc: 0
      },

      budget: 0,
      percentage: -1
    }

      return{

        addNewItem: function(type, des, val)
        {
          var newItem,Id;

            if(data.allItems[type].length!==0)
            {
              Id= data.allItems[type][(data.allItems[type].length)-1].id +1;
            }
            else if(data.allItems[type].length===0)
            {
              Id=0;
            }

          if(type==='exp')
           {
            newItem= new Expense(Id,des,val);
           }   
           else if(type==='inc')
           {
            newItem = new Income(Id,des,val); 
           }


           data.allItems[type].push(newItem);
           //return the new element....
          return newItem; 
        },



        deleteNewItm: function(type, Id)
        {

          var ids = data.allItems[type].map(function(current)
            {
              return current.id;
            });

          var index= ids.indexOf(Id);
          if(index !== -1)
          {

            data.allItems[type].splice(index,1);


          }



        },
      
        calculateBudget: function()
        {

          //calculate total income and expenses.....
          calculateTotalSum('exp');
          calculateTotalSum('inc');  


          //calculate the budget i.e income-expenses.....

          data.budget= data.total.inc - data.total.exp;

          //calculate the percentage of income and expenses.....
          data.percentage= Math.round((data.total.exp/data.total.inc)*100);
          


        },



        getbudget: function()

        {

          return {

              budget: data.budget,
            totalInc: data.total.inc,
            totalExp: data.total.exp,
            totalPer: data.percentage

          };


        },




          testing: function()
        {
          console.log(data);


        }
        


      };






 })();

 
 








 var UIController=(function()

 	{
 		var strings ={

                inputType: '.add__type',
                inputDescription: '.add__description',
                inputValue: '.add__value',
                inputBtn: '.add__btn',
                incomeContainer: '.income__list',
                expenseContainer: '.expenses__list',
                budgetLabel: '.budget__value',
                expensesLabel: '.budget__expenses--value',
                incomeLabel: '.budget__income--value',
                percentageLabel: '.budget__expenses--percentage',
                container: '.container',
                monthSelector: '.budget__title'


    };
 		return{ 
 			inputData: function(){ 
 		
 		return{
 			type: document.querySelector(strings.inputType).value,
 			description: document.querySelector(strings.inputDescription).value,
 			value: parseFloat(document.querySelector(strings.inputValue).value)
 	
 		};
 			
 				},

        addListItem: function(obj,type)
        {
          var element,html, newhtml;

          if(type==='inc')
          {
            element=strings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          }
          else if(type==='exp')
          {
            element=strings.expenseContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          }

          //replacing the data of the placeholder with some actual data...-----

           newhtml=html.replace('%id%',obj.id);
           newhtml=newhtml.replace('%description%',obj.description);
           newhtml=newhtml.replace('%value%',obj.value);
           
           document.querySelector(element).insertAdjacentHTML('beforeEnd', newhtml);
           


        },



        deleteListItem: function(selectorID)
        {

         var em= document.getElementById(selectorID);
         em.parentNode.removeChild(em);


        },


        clearIt: function()
        {

          var field,fieldArr;

          field = document.querySelectorAll(strings.inputDescription +','+ strings.inputValue);
          fieldArr = Array.prototype.slice.call(field);
          fieldArr.forEach(function(current, index, array)
          {
            current.value="";

            });
          fieldArr[0].focus();
          

        },
        FOCUSit: function()
        {
           var field,fieldArr;
          field = document.querySelectorAll(strings.inputDescription +','+ strings.inputValue);
          fieldArr = Array.prototype.slice.call(field);
          fieldArr[1].focus();


        },

        displayBudget: function(obj)
        {
          document.querySelector(strings.budgetLabel).textContent = obj.budget;
          document.querySelector(strings.expensesLabel).textContent = obj.totalExp;
          document.querySelector(strings.incomeLabel).textContent = obj.totalInc;
          document.querySelector(strings.percentageLabel).textContent = obj.totalPer;


        },

        formatNumber: function(num, type)
        {
          num= Math.abs(num);
          num= num.toFixed(2);



        },


        displayMonth: function()
        {

         var now = new Date();
       var html2= '<div class="budget__title">Available Budget in <span class="budget__title--month">%Month%</span>:</div>'
     // document.querySelector(strings.monthSelector).replace("%Month%",now);

     var newHtml2= html2.replace("%Month%",now );

     document.querySelector(strings.monthSelector).insertAdjacentHTML('beforeEnd', newHtml2);

        }, 


 		getStrings: function()
    {

      return strings;

    }
               
};
 			

 	})();



  

 var appController=(function(budgetcntrl,UIcntrl)
 	{
    var  getstrings= UIcntrl.getStrings();


    var setEventListener= function(){

    document.querySelector(getstrings.inputBtn).addEventListener('click',addItem);

  document.addEventListener('keypress', function(event)
  {
    if(event.keyCode===13)
     {
        addItem();
        
     }  
  });

    document.querySelector(getstrings.container).addEventListener('click',deleteItm);
// focus
      
      document.addEventListener('keypress',function(event)
       {
          if(event.keyCode === 17)
        {

          FOCUSit();
        }
       } );

    };
  
//slice
    var UpdateBudget= function()
    {


      //calculate the budget

      budgetcntrl.calculateBudget();
      //return the budget
      var budget = budgetcntrl.getbudget();     
      console.log(budget);
      //display the budget..
    
       UIcntrl.displayBudget(budget);



    };
  
 		var addItem= function()
 		{
 		

 			//first take the input from
 			var input = UIcntrl.inputData();
 			
 			//console.log(input);
     if(input.Description !== "" && !isNaN(input.value) && input.value > 0 )
     {

        //second dropit to budget contrler
      var newItem = budgetcntrl.addNewItem(input.type,input.description,input.value);



      // display the final to the UI

      UIcntrl.addListItem(newItem, input.type);
      // delete the input from the box....

      UIcntrl.clearIt();

      UpdateBudget();


     } 			
      //third drop it to the UI
 			//run the methods of the budget controlUI
 		};



    var deleteItm=function(event)

    { 
      var itmId,Type, ID; 

       itmId =event.target.parentNode.parentNode.parentNode.parentNode.id;
       //console.log(itmId);

      if(itmId)
      {
        var splitId=itmId.split('-');
          Type=splitId[0];
           ID= parseFloat(splitId[1]);

        // Delete the item from the data structure...
        budgetcntrl.deleteNewItm(Type,ID);

        //Delete the item from the UI format..
         UIcntrl.deleteListItem(itmId);

        //And update the item in the UI...

        UpdateBudget();


      }
        

    }
      return{
        callEventListener: function()
        {
            console.log( "let's rock the stage!!!!");
            UIcntrl.displayBudget(
            {
                 budget: 0,
            totalInc: 0,
            totalExp: 0,
            totalPer: -1


            }

           

              );

          UIcntrl.displayMonth();
            setEventListener();
        },
         //UIcntrl.displayMonth();
        
      };

 	

 	})(budgetController,UIController);

  appController.callEventListener();