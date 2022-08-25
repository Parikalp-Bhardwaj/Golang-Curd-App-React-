package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Details struct {
	ID      primitive.ObjectID `json:"_id,omitempty" bson:"id,omitempty"`
	Name    string             `json:"name,omitempty"`
	Email   string             `json:"email,omitempty"`
	Contact uint               `json:"contact,omitempty"`
	Address string             `json:"address,omitempty"`
}

var details []Details

var collection *mongo.Collection

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello-World")
	})
	r.HandleFunc("/users", getUsers).Methods("GET")
	r.HandleFunc("/users", CreateUser).Methods("POST")
	r.HandleFunc("/users/{id}", DeleteUser).Methods("DELETE", "OPTIONS")
	log.Fatal(http.ListenAndServe(":5000", r))
	fmt.Println("Server Running")

}

func init() {
	loadTheEnv()
	createDB()
}

func createDB() {

	connectionString := os.Getenv("DB_URI")
	dbName := os.Getenv("DB_NAME")
	colName := os.Getenv("DB_COL")

	clientOptions := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	collection = client.Database(dbName).Collection(colName)

	fmt.Println("MongoDb Connection success")

	// Ping() method to tell you if a MongoDB database has been found and connected.
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

}

func loadTheEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading the file .env")
	}

}

func getUsers(w http.ResponseWriter, h *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	res := getusers()
	json.NewEncoder(w).Encode(res)

}

func getusers() []primitive.M {
	cur, err := collection.Find(context.Background(), bson.D{{}})

	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		er := cur.Decode(&result)
		if er != nil {
			panic(er)
		}
		results = append(results, result)

	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var detail Details
	json.NewDecoder(r.Body).Decode(&detail)
	createuser(detail)
	json.NewEncoder(w).Encode(detail)

}

func createuser(detail Details) {
	cur, err := collection.InsertOne(context.Background(), detail)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("User has been created ", cur.InsertedID)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	deleteuser(params["id"])

}

func deleteuser(detail string) {
	fmt.Println("detail ", detail)
	id, _ := primitive.ObjectIDFromHex(detail)
	filter := bson.M{"_id": id}
	fmt.Println("filter ", filter)
	d, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Deleted Document ", d.DeletedCount)
}
