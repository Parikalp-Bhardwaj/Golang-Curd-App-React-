FROM golang:1.12-alpine
RUN mkdir /app
RUN apk add --no-cache git

# Set the Current Working Directory inside the container
WORKDIR /app
ADD . /app
# We want to populate the module cache based on the go.{mod,sum} files.
COPY go.mod .
COPY go.sum .
COPY .env .
RUN go mod download

COPY . .

# Build the Go app
RUN go build -o main .


# This container exposes port 8080 to the outside world
EXPOSE 5000

# Run the binary program produced by `go install`
CMD ["/app/main"]



# docker run -it -p 5000:5000 --name c-1 go_img
# docker build -t go_img .