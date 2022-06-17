var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51LBZknJXVa4eSe88W5lwvQQBUxtI76SsaPafjtDwE1bDfx3uQeSC6UmXTH9Ykqay4q9iAajfrS04g8Fbcxoevhu000Ly2NkIZd')

var dataBikeVar = [
  { name: "BIK045", url: "/images/bike-1.jpg", price: 679 },
  { name: "ZOOK07", url: '/images/bike-2.jpg', price: 999 },
  { name: "TITANS", url: '/images/bike-3.jpg', price: 799 },
  { name: "CEWO", url: '/images/bike-4.jpg', price: 1300 },
  { name: "AMIG39", url: '/images/bike-5.jpg', price: 479 },
  { name: "LIK099", url: '/images/bike-6.jpg', price: 869 }
]


// Home page
router.get('/', function (req, res, next) {
  // console.log(req.session.dataCardBikeVar);
  // -> undefined

  if (req.session.dataCardBikeVar == undefined) {
    req.session.dataCardBikeVar = []
  }

  res.render('index', { title: 'BikeShop - Home', dataBikeEJS: dataBikeVar, dataCardBikeEJS: req.session.dataCardBikeVar });
});


//Shop
router.get('/shop', function (req, res, next) {

  var alreadyExist = false;

  // On va passer dans cette boucle en premier :
  // (Si le vélo existe déjà dans le shop, on rajoute 1)
  for (var i = 0; i < req.session.dataCardBikeVar.length; i++) {
    if (req.session.dataCardBikeVar[i].name == req.query.bikeNameFromFront) {
      req.session.dataCardBikeVar[i].quantity += 1;
      // req.session.dataCardBikeVar[i].quantity = Number(req.session.dataCardBikeVar[i].quantity) + 1;

      //on met le booléen à true, donc pas besoin d'aller dans la boucle suivante = break;
      alreadyExist = true;
    }
  }

  // Si le vélo n'existe pas encore dans le shop, on passe dans cette boucle :
  if (alreadyExist == false) {
    req.session.dataCardBikeVar.push({
      name: req.query.bikeNameFromFront,
      url: req.query.bikeUrlFromFront,
      price: req.query.bikePriceFromFront,
      quantity: 1
    })
  }

  res.render('shop', { dataCardBikeEJS: req.session.dataCardBikeVar });
});

//Delete bike
router.get('/delete-shop', function (req, res) {
  req.session.dataCardBikeVar.splice(req.query.position, 1)
  res.render('shop', { dataCardBikeEJS: req.session.dataCardBikeVar });
})

//Update shop
router.post('/update-shop', function (req, res) {
  let position = req.body.position
  let newQuantity = req.body.quantity
  req.session.dataCardBikeVar[position].quantity = newQuantity
  res.render('shop', { dataCardBikeEJS: req.session.dataCardBikeVar });
})

// Stripe

var new_line_items = []



// router.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'eur',
//           product_data: {
//             name: 'Vélo BIK098',
//           },
//           unit_amount: 2000,
//         },
//         quantity: 2,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'http://localhost:3000/success',
//     cancel_url: 'http://localhost:3000/cancel',
//   });

//   res.redirect(303, session.url);
// });



router.post('/create-checkout-session', async (req, res) => {
  var line_items_update = [];

  for (var i = 0; i < req.session.dataCardBikeVar.length; i++) {
    line_items_update.push(
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: req.session.dataCardBikeVar[i].name,
          },
          unit_amount: req.session.dataCardBikeVar[i].price * 100,
        },
        quantity: req.session.dataCardBikeVar[i].quantity,
      },
    );
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items_update,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });
  res.redirect(303, session.url);
});




// Page confirmation de la commande
router.get('/success', (req, res) => {
  res.render('success');
});

// Page confirmation de l'annulation
router.get('/cancel', (req, res) => {
  res.render('cancel');
});


module.exports = router;
