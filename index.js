const express = require( 'express' );
const { MongoClient } = require( 'mongodb' );
const ObjectId = require( 'mongodb' ).ObjectId;

const cors = require( 'cors' );
require( 'dotenv' ).config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use( cors() );
app.use( express.json() );

// password     BpYE6bSOn8P70NAg BpYE6bSOn8P70NAg
// userName  mydbuser2
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9mcb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

async function services() {
    try {
        await client.connect();
        const database = client.db( 'delivery' );
        const servicesCollection = database.collection( 'services' );

        // GET API
        app.get( '/services', async ( req, res ) => {
            const cursor = servicesCollection.find( {} );
            const services = await cursor.toArray();
            res.send( services );
        } );

        // GET Single Service
        app.get( '/services/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const service = await servicesCollection.findOne( query );
            res.json( service );
        } )

        // POST API
        app.post( '/services', async ( req, res ) => {
            const service = req.body;
            const result = await servicesCollection.insertOne( service );
            res.json( result )
        } );

        // DELETE API
        app.delete( '/services/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await servicesCollection.deleteOne( query );
            res.json( result );
        } )
    }
    finally {
        // await client.close();
    }
}

services().catch( console.dir );

async function carusel() {
    try {
        await client.connect();
        const database = client.db( 'delivery' );
        const caruselCollection = database.collection( 'carusel' );

        // GET API
        app.get( '/carusel', async ( req, res ) => {
            const cursor = caruselCollection.find( {} );
            const carusel = await cursor.toArray();
            res.send( carusel );
        } );

    }
    finally {
        // await client.close();
    }
}

carusel().catch( console.dir );

async function happyCus() {
    try {
        await client.connect();
        const database = client.db( 'delivery' );
        const customerCollection = database.collection( 'customer' );

        // GET API
        app.get( '/customer', async ( req, res ) => {
            const cursor = customerCollection.find( {} );
            const customer = await cursor.toArray();
            res.send( customer );
        } );

    }
    finally {
        // await client.close();
    }
}

happyCus().catch( console.dir );

async function confirmOrder() {
    try {
        await client.connect();
        const database = client.db( 'delivery' );
        const confirmCollection = database.collection( 'confirm' );

        // cofirm order
        app.post( "/confirmOrder", async ( req, res ) => {
            const result = await confirmCollection.insertOne( req.body );
            res.send( result );
        } );

        // my confirmOrder

        app.get( "/myOrders/:email", async ( req, res ) => {
            const result = await confirmCollection
                .find( { email: req.params.email } )
                .toArray();
            res.send( result );
        } );

        /// delete order
        app.delete( "/deleteOrder/:id", async ( req, res ) => {
            const result = await confirmCollection.deleteOne( {
                _id: ObjectId( req.params.id ),
            } );
            res.send( result );
        } );

        // all order
        app.get( "/allOrders", async ( req, res ) => {
            const result = await confirmCollection.find( {} ).toArray();
            res.send( result );
        } );

    }
    finally {
        // await client.close();
    }
}

confirmOrder().catch( console.dir );


app.get( '/', ( req, res ) => {
    res.send( 'Running my CRUD server , Form My heart, hey you' )
} )

app.listen( port, () => {
    console.log( `Example app listening at http://localhost:${port}` )
} )