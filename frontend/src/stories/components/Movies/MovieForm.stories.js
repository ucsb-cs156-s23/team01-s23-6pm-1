import React from 'react';
import MovieForm from "main/components/Movies/MovieForm"
import { restaurantFixtures } from 'fixtures/restaurantFixtures';

export default {
    title: 'components/Movies/MovieForm',
    component: MovieForm
};

const Template = (args) => {
    return (
        <MovieForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Movie: restaurantFixtures.oneMovie,
    submitText: "",
    submitAction: () => { }
};