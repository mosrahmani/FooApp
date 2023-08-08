import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const onDragEnd = (result, imageItems, setImageItems) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceImage = imageItems[source.droppableId];
    const destImage = imageItems[destination.droppableId];
    const sourceImageItems = [...sourceImage.items];
    const destImageItems = [...destImage.items];
    const [removed] = sourceImageItems.splice(source.index, 1);

    destImageItems.splice(destination.index, 0, removed);
    setImageItems({
      ...imageItems,
      [source.droppableId]: {
        ...sourceImage,
        items: sourceImageItems,
      },
      [destination.droppableId]: {
        ...destImage,
        items: destImageItems,
      },
    });
  } else {
    const image = imageItems[source.droppableId];
    const copiedImageItems = [...image.items];
    const [removed] = copiedImageItems.splice(source.index, 1);
    copiedImageItems.splice(destination.index, 0, removed);
    setImageItems({
      ...imageItems,
      [source.droppableId]: {
        ...image,
        items: copiedImageItems,
      },
    });
  }
};

function App() {
  const [image, setImage] = useState("");
  const [imageItems, setImageItems] = useState({});

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => setImage(reader.result);
    file && reader.readAsDataURL(file);
  };

  const addNewBox = () => {
    if (!image) return;

    const imageDetails = {
      imgId: uuidv4(),
      content: image,
    };

    setImageItems({
      ...imageItems,
      ["item-" + uuidv4()]: { id: uuidv4(), items: [imageDetails] },
    });

    setImage("");
  };

  return (
    <main className="h-screen flex flex-col py-24 w-[32rem] max-w-xl">
      <h1 className="text-blue-800 text-2xl text-center font-extrabold mb-8">
        Foo App 😉
      </h1>
      <div
        className={`flex justify-between items-center mb-10 md:w-full bg-white shadow-2xl shadow-blue-400/50 py-3 px-6 rounded-lg ${
          image && "border border-dashed border-green-800"
        }`}
      >
        <label htmlFor="file" className="cursor-pointer">
          {image ? (
            <strong className="text-green-800">✔ 1 photo selected ...</strong>
          ) : (
            <div>🎈 Select new image file now ...</div>
          )}{" "}
        </label>
        <input
          id="file"
          type="file"
          className="bg-white p-4 rounded-lg"
          accept="jpg, jpeg, png"
          onChange={handleImagePreview}
          hidden
        />
        <button
          className="bg-blue-800 text-white font-bold p-4 rounded-lg shadow-2xl shadow-blue-800/50 ml-2"
          onClick={addNewBox}
        >
          Add Image✨
        </button>
      </div>

      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, imageItems, setImageItems)}
      >
        <div
          id="boxWrapper"
          className="w-full flex flex-wrap justify-start max-w-xl"
        >
          {!Object.entries(imageItems).length && <div className="w-full py-6 text-center text-red-800 font-bold">Sorry! There's no photo yet :(</div>}
          {Object.entries(imageItems).map(([id, items], index) => {
            return (
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      className="flex flex-col shadow-2xl shadow-blue-400/50 bg-white rounded-lg overflow-hidden p-1 mb-4 w-full"
                      style={{ "min-height": "8rem" }}
                      key={id}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      {...snapshot.isDraggingOver}
                    >
                      {items.items.map((img, index) => {
                        return (
                          <Draggable
                            key={img.imgId}
                            draggableId={img.imgId}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <img
                                  src={img.content}
                                  alt="Image Preview"
                                  className="cursor-grab object-cover h-32"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    backgroundColor: snapshot.isDragging,
                                  }}
                                />
                              );
                            }}
                          </Draggable>
                        );
                      })}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </main>
  );
}

export default App;
