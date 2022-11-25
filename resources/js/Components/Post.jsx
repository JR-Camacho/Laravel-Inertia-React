import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Dropdown from "@/Components/Dropdown";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, usePage } from "@inertiajs/inertia-react";
import SecondaryButton from "./SecondaryButton";

dayjs.extend(relativeTime);
const Post = ({ post }) => {
    const { auth } = usePage().props;
    const [editing, setEditing] = useState(false);
    const { data, setData, patch, processing, reset, errors } = useForm({
        title: post.title,
        body: post.body,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("posts.update", post.id), {
            onSuccess: () => setEditing(false),
        });
    };

    return (
        <div className="p-5 flex space-x-2">
            <i className="fa-solid fa-message text-white"></i>

            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-white">{post.user.name}</span>
                        <small className="ml-2 text-sm text-white">
                            {dayjs(post.created_at).fromNow()} 
                        </small>
                        {post.created_at !== post.updated_at &&
                            <small className="text-sm text-gray-600">
                                &middot; Edited
                            </small>
                        }
                    </div>

                    {post.user.id === auth.user.id && 
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button>
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-200" onClick={()=> setEditing(true)}>Edit</button>
                                <Dropdown.Link
                                as='button'
                                href={route('posts.destroy', post.id)}
                                method='delete'
                                >
                                    Delete
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>}
                </div>
                {editing
                    ? <form onSubmit={submit}>
                        <input 
                        type="text" 
                        value={data.title}
                        onChange={e=>setData('title', e.target.value)}
                        className="mb-3 block w-full border-gray-300 focus:border-indigo-300 focus:ring mt-2"
                        autoFocus
                        />

                        <textarea
                        type="text" 
                        value={data.body}
                        onChange={e=>setData('body', e.target.value)}
                        className="mb-3 block w-full border-gray-300 focus:border-indigo-300 focus:ring"
                        >

                        </textarea>
                        <InputError message={errors.message} className="mt-2"></InputError>

                        <div className="space-x-2">
                            <PrimaryButton 
                            className="mt-4"
                            >
                            Save</PrimaryButton>

                            <SecondaryButton 
                            className="mt-4" 
                            onClick={()=> setEditing(false) && reset()}
                            >
                            Cancel</SecondaryButton>
                        </div>
                      </form>
                    : (
                        <>
                        <p className="mt-4 text-lg text-white">{post.title}</p>
                        <p className="mt-4 text-white">{post.body}</p>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Post;
